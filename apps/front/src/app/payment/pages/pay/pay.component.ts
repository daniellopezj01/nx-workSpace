/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ErrorComponent } from '../error/error.component';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { StripeService } from '../../services/stripe.service';
import * as _ from 'lodash'
import { RestService } from '../../../core/services/rest.service';
import { ModalsService } from '../../../core/services/modals.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  @ViewChild('inputAmount') inputAmount?: ElementRef;
  @ViewChild('cardInfoNumber') cardInfoNumber?: ElementRef;
  @ViewChild('cardInfoCvv') cardInfoCvv?: ElementRef;
  @ViewChild('cardInfoExp') cardInfoExp?: ElementRef;
  cardHandlerCard = this.onChangeCard.bind(this);
  cardHandlerCvv = this.onChangeCvv.bind(this);
  cardHandlerExp = this.onChangeExp.bind(this);
  public departure: any;
  public loading = false;
  public disabled = true;
  public elementStripe: any = [];
  public cardNumber: any = null;
  public cardExp: any = null;
  public cardCvv: any = null;

  public isReservation = false;
  public data: any;
  public amount: any;
  public errorMessage = 'error';
  public isAll: any;
  public payPercentage = 0;
  public amountInNumber = 0;
  public pCheckWallet = false;
  public activeFormPayment = true;
  public totalWallet = 0;
  public subPayment = false;
  public payForm: FormGroup;
  private pk = '';
  private operationType = '';
  private externalCode: any;
  private STRIPE: any;
  private codeReservation: any;

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private stripe: StripeService,
    private rest: RestService,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    public cookieService: CookieService,
    private modalService: ModalsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.payForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      checkTerms: [false, [Validators.required, Validators.requiredTrue]],
      checkTermsTwo: [false, [Validators.required, Validators.requiredTrue]],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    this.begin();
  }

  validateAgain(data: any): any {
    this.payForm.get('amount')?.setValidators([Validators.required, Validators.max(data?.pending), Validators.min(1)]);
    this.payForm.get('amount')?.updateValueAndValidity();
  }

  begin() {
    this.operationType = this.activeRouter.snapshot.params.operationType;
    this.codeReservation = this.activeRouter.snapshot.params.id;
    this.externalCode = this.activeRouter.snapshot.params.externalCode;
    this.loading = true;
    if (this.externalCode) {
      if (this.operationType === 'flights') {
        this.loading = false;
        this.rest.get(`validateFlights/${this.externalCode}`).subscribe(
          res => {
            const { data, pk } = res
            this.pk = pk;
            this.loadScripts();
            this.data = _.head(data)
            this.payForm.patchValue({ amount: this.data?.price.totalPrice });
            this.renderer.setAttribute(
              this.inputAmount?.nativeElement,
              'readonly',
              'true'
            );
            this.loading = false;
          }, err => {
            //colocar que retorne a algun lado por si hay error
            this.router.navigate([''])
            this.loading = false;
            console.log(err)
          })
      } else {
        this.router.navigate([''])
      }
    } else if (this.codeReservation) {
      this.isReservation = true;
      this.rest
        .get(`reservations/payment/${this.codeReservation}`)
        .pipe(
          tap(() => (this.loading = false)),
          catchError((err) => {
            this.loading = err;
            return throwError(err);
          })
        )
        .subscribe(
          (res: any) => {
            // aqui se debe cargar el formulario de tarjeta de credito
            this.data = res;
            const { status, totalPayment, totalWallet, pk, departure } = res;
            this.pk = pk;
            this.departure = departure;
            this.loadScripts();
            this.validateAgain(res);
            this.totalWallet = totalWallet.total;
            if (status === 'pending') {
              this.pCheckWallet = this.totalWallet >= totalPayment;
              this.payForm.patchValue({ amount: totalPayment });
              this.renderer.setAttribute(
                this.inputAmount?.nativeElement,
                'readonly',
                'true'
              );
            } else if (status === 'progress') {
              this.pCheckWallet = this.totalWallet > 0;
            } else if (status === 'completed') {
              this.router.navigate([`/trips/${this.codeReservation}`]);
            }
          },
          (err) => {
            console.log(err);
            this.router.navigate(['user/trips']);
          }
        );
    } else {
      this.rest.get('paymentMethods/default').subscribe(res => {
        this.pk = res.pk;
        this.loadScripts();
        this.loading = false;
      })
    }
  }

  onChangeCard({ error }: any) {
    this.payForm.patchValue({ cardNumber: !error });
    this.cd.detectChanges();
  }

  onChangeCvv({ error }: any) {
    this.payForm.patchValue({ cardCvv: !error });
    this.cd.detectChanges();
  }

  onChangeExp({ error }: any) {
    this.payForm.patchValue({ cardExp: !error });
    this.cd.detectChanges();
  }

  check($event: any, i: any) {
    if (i === 1) {
      this.payForm.patchValue({ checkTerms: $event.checked });
    } else {
      this.payForm.patchValue({ checkTermsTwo: $event.checked });
    }
  }

  checkPayAll({ checked }: any) {
    this.amount = checked ? this.data.pending : 0;
    this.payForm.patchValue({ amount: this.amount });
    if (this.data.status === 'progress' && this.totalWallet > 0) {
      this.pCheckWallet = !checked;
    }
  }

  paymentWIthWallet({ checked }: any) {
    this.activeFormPayment = !checked;
    setTimeout(() => {
      if (!checked) {
        this.loadScripts();
      }
    }, 100);
    if (this.data.status === 'progress') {
      if (checked) {
        this.amount = this.totalWallet > this.data.pending ? this.data.pending : this.totalWallet;
      } else {
        this.amount = 0;
      }
      this.payForm.patchValue({ amount: this.amount });
      if (checked) {
        this.renderer.setAttribute(this.inputAmount?.nativeElement, 'readonly', 'true');
      } else {
        this.renderer.removeAttribute(this.inputAmount?.nativeElement, 'readonly');
      }
    }
  }

  onChangeAmount(event: any) {
    if (this.data) {
      this.amountInNumber = this.transformString(event);
      const { pending } = this.data;
      this.payPercentage = (this.amountInNumber * 100) / pending;
    }
  }

  ActivePaymentWallet() {
    const { amount, checkTerms, checkTermsTwo } = this.payForm.value;
    const array = [amount, checkTerms, checkTermsTwo, !this.activeFormPayment];
    return array.includes(!!undefined);
  }

  private loadScripts = () => {
    this.stripe
      .load('stripe')
      .then((data: any) => {
        if (data) {
          data.map((a: any) => {
            if (a.script === 'stripe') {
              if (isPlatformBrowser(this.platformId)) {
                // @ts-ignore
                this.STRIPE = window.Stripe(this.pk);
                this.createStripeElement();
              }
            }
          });
        }
      })
      .catch((error) => console.log(error));
  }

  private createStripeElement = () => {
    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500&display=swap',
        },
      ],
    });
    const stripeStyle = {
      style: {
        base: {
          color: '#000000',
          fontWeight: 400,
          fontFamily: '\'Alata\', sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#6c757d',
          },
        },
        invalid: {
          color: '#dc3545',
        },
      },
      placeholder: '0000 0000 0000 0000',
    };
    const cardNumber = this.elementStripe.create('cardNumber', stripeStyle);
    const cardExp = this.elementStripe.create('cardExpiry', {
      ...stripeStyle,
      ...{ placeholder: 'MM/AA' },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      ...stripeStyle,
      ...{ placeholder: 'CVC' },
    });
    cardNumber.mount('#card_number');
    cardExp.mount('#card_exp');
    cardCvc.mount('#card_cvc');
    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;
    this.cardNumber.addEventListener('change', this.cardHandlerCard);
    this.cardExp.addEventListener('change', this.cardHandlerExp);
    this.cardCvv.addEventListener('change', this.cardHandlerCvv);
  }

  beginProcess = async () => {
    this.subPayment = true;
    this.loading = true;
    if (this.activeFormPayment) {
      this.STRIPE.createToken(this.cardNumber)
        .then(async (res: any) => {
          if (res.error) {
            this.loading = false;
          } else {
            this.payIntent(res.token.id);
          }
        })
        .catch((err: any) => {
          console.log(err);
          this.loading = false;
        });
    } else {
      // Se ejecuta cuando se paga con monedero
      const { amount } = this.payForm.value;
      const object = {
        idReservation: this.data.idReservation,
        amount: this.transformString(amount.toString()),
      };
      this.rest.post('payOrders', object).subscribe(res => {
        this.payForm.reset();
        this.loading = false;
        this.router.navigate([
          '/',
          'payment',
          'success',
          this.codeReservation || '',
        ]);
      }, (err) => {
        this.loading = false;
        this.openError('Error In Payment Operation');
      });
      console.log('hago el pago a monedero');
    }
  }

  transformString(str: string = ''): number {
    if (str) {
      const numberFix = str.toString().replace(/\s/g, '');
      return parseFloat(numberFix.replace(',', '.'));
    } else {
      return 0;
    }
  }

  payIntent = (token: any) => {
    const { amount } = this.payForm.value;
    const object: any = {
      token,
      pk: this.pk,
      amount: this.transformString(amount.toString()),
    };
    if (this.isReservation) {
      object.reference = this.data.idReservation;
    }
    if (this.externalCode && this.operationType) {
      object.operationType = this.operationType
      object.externalCode = this.externalCode
    }
    this.loading = true;
    this.rest.post(`stripe`, object).subscribe(
      (res: any) => {
        this.handlePi(res.client_secret).then((r: any) => {
          const obj = r.paymentIntent;
          this.rest
            .patch(`payOrders/${obj.id}`, obj)
            .pipe(
              tap(() => (this.loading = false)),
            )
            .subscribe(() => {
              this.loading = false
              this.payForm.reset();
              this.router.navigate([
                '/',
                'payment',
                'success',
                this.codeReservation || '',
              ]);
            },
              (err) => {
                console.log('error payment post', err.message);
                this.loading = false;
                this.openError('Error In Payment Operation');
              }
            );
        })
          .catch(err => {
            console.log('error payment catch', err.message);
            this.loading = false;
            this.openError(err.message);
          });
      },
      ({ error }) => {
        console.log('error payment post', error.errors.msg);
        this.loading = false;
        this.openError(error.errors.msg);
      }
    );
  }

  handlePi = (pi = '') => {
    this.changeButton(true);
    return new Promise((resolve, reject) => {
      this.STRIPE.handleCardPayment(pi, this.cardNumber, {
        payment_method_data: {},
      })
        .then((a: any) => {
          if (a.error) {
            reject(a.error);
          } else {
            resolve(a);
          }
        })
        .catch((err: any) => {
          console.log(err.message);
          this.changeButton(false);
          reject(err);
        });
    });
  }

  openError(message: any) {
    const data = { errorStripe: message };
    this.modalService.openComponent(
      data,
      ErrorComponent,
      'modal-md w-100'
    );
  }

  changeButton(b: any) {
    this.loading = b;
    this.disabled = b;
  }
}
