import { Component, OnDestroy, OnInit } from '@angular/core';
import { Model, RenderingStyleMode } from '@sheencity/diva-sdk';
import { plainToClass } from 'class-transformer';
import {
  MonitorConfigDto,
  MonitorEquiConfigDto,
} from 'src/app/common/dtos/monitor.dto';
import { DivaService } from 'src/app/common/services/diva.service';

const monitors = plainToClass(MonitorConfigDto, [
  {
    title: '监控设备1号',
    url: 'https://vod.sheencity.com/1b290a633b6641e98d861684d6865947/b311b7d4a6b846c795a5ae82f5f0ac14-960f017f69a2b1268ee4bc71d286cf45-ld.mp4',
  },
  {
    title: '监控设备2号',
    url: 'https://vod.sheencity.com/1b290a633b6641e98d861684d6865947/b311b7d4a6b846c795a5ae82f5f0ac14-960f017f69a2b1268ee4bc71d286cf45-ld.mp4',
  },
  {
    title: '监控设备3号',
    url: 'https://vod.sheencity.com/1b290a633b6641e98d861684d6865947/b311b7d4a6b846c795a5ae82f5f0ac14-960f017f69a2b1268ee4bc71d286cf45-ld.mp4',
  },
  {
    title: '监控设备4号',
    url: 'https://vod.sheencity.com/1b290a633b6641e98d861684d6865947/b311b7d4a6b846c795a5ae82f5f0ac14-960f017f69a2b1268ee4bc71d286cf45-ld.mp4',
  },
  {
    title: '弹窗1号设备',
    url: 'https://www.sheencity.com',
  },
  {
    title: '弹窗2号设备',
    url: 'https://www.sheencity.com',
  },
  {
    title: '弹窗3号设备',
    url: 'https://www.sheencity.com',
  },
  {
    title: '弹窗4号设备',
    url: 'https://www.sheencity.com',
  },
]);

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
})
export class MonitorComponent implements OnInit, OnDestroy {
  // 监控设备
  monitors = monitors.slice(0, 4);
  // 弹窗设备
  monitorEquis = monitors.slice(4, 8);
  // 设备模型列表
  monitorModels: Model[] = [];
  // 事件句柄列表
  monitorHandlers = [];
  // 选中的监控列表
  selectedMonitorIndex: number = -1;
  constructor(private _diva: DivaService) {}

  async selectMonitor(monitor: MonitorConfigDto, index: number, isPop: boolean) {
      index = isPop ? index + 4 : index;
      try {
        if (this.selectedMonitorIndex >= 0) {
          await this._diva.client.request('DestroyWebWidget', {id: this.monitorModels[this.selectedMonitorIndex].id});
        }
      } catch {
      }
      await this._diva.client.request('Focus', {
        id: this.monitorModels[index].id,
        distance: 1000.0,
        pitch: 30.0,
      })
      this.selectedMonitorIndex = index;
  }

  async refresh(monitorEqui: MonitorEquiConfigDto, index: number) {
    index = index + 4;
    console.log('monitorEqui is', monitorEqui, index);
    try {
      await this._diva.client.request('DestroyWebWidget', {id: this.monitorModels[index].id});
    } catch {
    }
    await this._diva.client.request('CreateWebWidget', {
      id: this.monitorModels[index].id,
      widget: {
        url: monitorEqui.url,
        width: 500,
        height: 280,
      },
    })
    // 此处设置设备网址刷新信息
  }

  onKeydown($event) {
    $event.stopPropagation();
  }

  async ngOnInit() {
    this._diva.client.applyScene('监控设备')
    for (let i=0; i < 8; i++) {
      let model: Model;
      let url: string;
      if (i < 4) {
        model = (await this._diva.client.getEntitiesByName<Model>(this.monitors[i].title))[0];
        url = this.monitors[i].url;
      } else {
        model = (await this._diva.client.getEntitiesByName<Model>(this.monitorEquis[i - 4].title))[0];
        url = this.monitorEquis[i - 4].url;
      }
      const handle = () => {
        this._diva.client.request('CreateWebWidget', {
          id: model.id,
          widget: {
            url,
            width: 500,
            height: 280,
          }
        })
      }
      model.setRenderingStyleMode(RenderingStyleMode.Default);
      model.addEventListener('click', handle)
      this.monitorModels.push(model);
      this.monitorHandlers.push(handle);
    }
  }

  // 销毁钩子
  ngOnDestroy(): void {
    this.monitorModels.forEach((monitor, index) => monitor.removeEventListener('click', this.monitorHandlers[index]));
    this.monitorModels.forEach((monitor) => this._diva.client.request('DestroyWebWidget', {id: monitor.id}));
  }
}
