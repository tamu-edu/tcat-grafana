import { BusEventWithPayload } from '@grafana/data';

export class PropertyEvent extends BusEventWithPayload<{ properties: string[] }> {
  static type = 'property-event';
}
