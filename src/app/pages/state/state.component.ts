import { Component, OnDestroy, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { DropdownData } from 'src/app/common/dtos/dropdown-data.interface';
import {
  EquipmentConfigDto,
  EquipmentState,
} from 'src/app/common/dtos/equipment.dto';
import { DivaService } from 'src/app/common/services/diva.service';

const equipments = plainToClass(EquipmentConfigDto, [
  {
    title: '1号设备',
    id: '1',
    state: EquipmentState.Default,
  },
  {
    title: '2号设备',
    id: '2',
    state: EquipmentState.Alarm,
  },
  {
    title: '1号设备',
    id: '3',
    state: EquipmentState.Translucence,
  },
  {
    title: '1号设备',
    id: '4',
    state: EquipmentState.Hidden,
  },
]);

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
})
export class StateComponent implements OnInit, OnDestroy {
  selected: number = null;
  active: number;
  equipments = equipments.map((equipment) => this.addSelected(equipment));
  constructor(private _diva: DivaService) {}

  options = [
    { value: EquipmentState.Default, placeholder: '默认' },
    { value: EquipmentState.Alarm, placeholder: '报警' },
    { value: EquipmentState.Translucence, placeholder: '半透' },
    { value: EquipmentState.Hidden, placeholder: '隐藏' },
  ];

  private addSelected(equipment: EquipmentConfigDto) {
    let selected: DropdownData<EquipmentState>;
    switch (equipment.state) {
      case EquipmentState.Default:
        selected = { value: EquipmentState.Default, placeholder: '默认' };
        break;
      case EquipmentState.Alarm:
        selected = { value: EquipmentState.Alarm, placeholder: '报警' };
        break;
      case EquipmentState.Translucence:
        selected = { value: EquipmentState.Translucence, placeholder: '半透' };
        break;
      case EquipmentState.Hidden:
        selected = { value: EquipmentState.Hidden, placeholder: '隐藏' };
        break;
      default:
        selected = { value: EquipmentState.Default, placeholder: '默认' };
        break;
    }
    return { ...equipment, selected };
  }

  async onClick(equi: EquipmentConfigDto, i: number) {
    const [model] = await this._diva.client.getEntitiesByName(this.equipments[i].title)
    if(!model) return
    const equipmentId = model.id
    this.active = i;
    this.selected = i;
    this._diva.client.request('Focus', {
      id: equipmentId,
      distance: 1000.0,
      pitch: 30.0,
    });
    console.log('equi', equi);
    // 此处设置设备的聚焦状态
  }

  async onChange(i: number, $event: DropdownData) {
    const [model] = await this._diva.client.getEntitiesByName(this.equipments[i].title)
    if(!model) return
    const id = model.id
    const type = $event.value;
    console.log(id, type);
    // 此处设置渲染状态
    this._diva.client.request('SetRenderStatus', {
      id,
      type,
    });
  }

  ngOnInit(): void {
    // console.log(this.equipments);
    this._diva.client?.applyScene('状态演示');
  }

  // 销毁钩子
  ngOnDestroy(): void {}
}
