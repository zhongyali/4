import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/components/header/header.component';
import { NavComponent } from './common/components/nav/nav.component';
import { ContentBlockComponent } from './common/components/content-block/content-block.component';
import { EventBlockComponent } from './common/components/event-block/event-block.component';

import { SceneComponent } from './pages/scene/scene.component';
import { VideoComponent } from './pages/video/video.component';
import { WeatherComponent } from './pages/weather/weather.component';
import { DateComponent } from './pages/date/date.component';
import { StateComponent } from './pages/state/state.component';
import { PoiComponent } from './pages/poi/poi.component';
import { CustomizeComponent } from './pages/customize/customize.component';
import { BasicComponent } from './pages/basic/basic.component';
import { GlobalComponent } from './pages/global/global.component';

const COMPONENTS = [
  AppComponent,
  HeaderComponent,
  NavComponent,
  ContentBlockComponent,
  EventBlockComponent,
];
const PAGES = [
  SceneComponent,
  VideoComponent,
  WeatherComponent,
  DateComponent,
  StateComponent,
  PoiComponent,
  CustomizeComponent,
  BasicComponent,
  GlobalComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PAGES,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
