import { Expose } from 'class-transformer';

export enum EquipmentState {
    Default = 'default',
    Alarm = 'alarm',
    Translucent = 'translucent',
    Hidden = 'hidden',
}
export class  EquipmentConfigDto {
    @Expose() public readonly title: string;
    @Expose() public readonly id: string;
    @Expose() public readonly state: EquipmentState;
}