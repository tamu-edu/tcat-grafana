import { BusEventWithPayload, SelectableValue } from '@grafana/data';

export class PropertyEvent extends BusEventWithPayload<{ properties: Array<SelectableValue<string>> }> {
  static type = 'property-event';
}
