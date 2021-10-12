/* eslint-disable no-inner-declarations */
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import MapBox from 'mapbox-gl';

import _ from 'lodash';
import turf from '@turf/turf';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../core/services/rest.service';

@Component({
  selector: 'app-map-tour',
  templateUrl: './map-tour.component.html',
  styleUrls: ['./map-tour.component.scss'],
})
export class MapTourComponent implements OnInit, AfterViewInit {
  @Input() tour: any;
  @Input() marker = true;
  public map?: any;
  // public map?: MapBox.Map;
  public dataCoordinate: any = [];
  public markers: any = [];
  // markers: MapBox = [];
  public arc: any = [];
  public small = false;
  public activeFirstChange = false;

  constructor(
    private rest: RestService,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngOnInit(): void {
    if (this.tour) {
      const { itinerary } = this.tour;

      if (MapBox) {
        // Object.getOwnPropertyDescriptor(MapBox, 'accessToken').set(environment.mapBoxApi)
        MapBox.accessToken = environment.mapBoxApi;
        // Object.getOwnPropertyDescriptor(MapBox, 'accessToken').set(environment.mapBoxApi)
      }
      _.forEach(itinerary, (a) => {
        const point = a.stringLocation.coordinates;
        if (a.includedInMap || a.includedInMap === undefined) {
          this.dataCoordinate.push(
            [
              Number(parseFloat(point[1]).toFixed(4)),
              Number(parseFloat(point[0]).toFixed(4))
            ]
          );
        }
      });
      if (isPlatformBrowser(this.platformId)) {
        this.loadInfoMap();
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.activeFirstChange) {
        this.small = window.innerWidth < 760;
        const el = document?.getElementById('map')
        if (el) {
          el.setAttribute(
            'style',
            `height:${this.small ? '300' : '600'}px !important`
          );
        }
        if (this.map) {
          this.map.resize();
        }
        setTimeout(() => {
          this.activeFirstChange = true;
        }, 0);
      }
    }
  }

  loadInfoMap() {
    const point: any = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: _.head(this.dataCoordinate),
          },
        },
      ],
    };
    const routers: any = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: this.dataCoordinate,
          },
        },
      ],
    };
    const origin = _.head(this.dataCoordinate);
    let counter = 0;
    const steps = 150;
    const lineDistance = turf.lineDistance(routers.features[0], {
      units: 'kilometers',
    });

    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment: any = turf.along(routers.features[0], i, {
        units: 'kilometers',
      });
      this.arc.push(segment.geometry.coordinates);
    }
    routers.features[0].geometry.coordinates = this.arc;
    this.map = new MapBox.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      // center: this.dataCoordinate[this.dataCoordinate.length - 1],
      zoom: 5,
      interactive: true
    });

    this.map.on('load', () => {
      if (isPlatformBrowser(this.platformId)) {
        this.map?.addSource('route', {
          type: 'geojson',
          data: routers,
        });
        this.map?.addSource('point', {
          type: 'geojson',
          data: point,
        });
        const mapa = this.map;
        this.map?.addLayer({
          id: 'route',
          source: 'route',
          type: 'line',
          paint: {
            'line-width': 2,
            'line-color': '#ef233c',
          },
        });
        this.map?.addLayer({
          id: 'point',
          source: 'point',
          type: 'symbol',
          layout: {
            'icon-image': 'airport-15',
            'icon-rotate': ['get', 'bearing'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });

        function animate() {
          point.features[0].geometry.coordinates =
            routers.features[0].geometry.coordinates[counter];
          point.features[0].properties.bearing = 0;
          const { coordinates } = routers.features[0].geometry;
          const firstCoordinate =
            coordinates[counter >= steps ? counter - 1 : counter];
          const secondCoordinate =
            coordinates[counter >= steps ? counter : counter + 1];
          if (firstCoordinate && secondCoordinate) {
            point.features[0].properties.bearing = turf.bearing(
              turf.point(firstCoordinate),
              turf.point(secondCoordinate)
            );
            mapa?.getSource('point').setData(point);
          }
          if (counter < steps) {
            requestAnimationFrame(animate);
          }
          counter = counter + 1;
        }

        const mainElement = document.getElementById('replay');
        if (mainElement) {
          mainElement.addEventListener('click', () => {
            point.features[0].geometry.coordinates = origin;
            mapa?.getSource('point').setData(point);
            counter = 0;
            animate();
          });
        }
      }
    });
    if (this.marker) {
      _.forEach(this.dataCoordinate, (a) => {
        this.addMarker(a);
      });
    }

    this.map.scrollZoom.disable();
    this.map.resize();
    this.map.addControl(new MapBox.NavigationControl());
    const bounds = this.dataCoordinate.reduce((bound: any, coordinate: any) => {
      return bound.extend(coordinate);
    }, new MapBox.LngLatBounds(this.dataCoordinate[0], this.dataCoordinate[0]));
    this.map.fitBounds(bounds, {
      padding: 50
    });
  }

  addMarker(coordinate: any) {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.createElement('div');
      el.className = 'marker-custom';
      if (this.map) {
        const pointMarker = new MapBox.Marker({
          draggable: false,
        })
          .setLngLat(coordinate)
          .addTo(this.map);
        this.markers.push(pointMarker);
      }
    }
  }

  // ngAfterViewInit(): void {}
}
