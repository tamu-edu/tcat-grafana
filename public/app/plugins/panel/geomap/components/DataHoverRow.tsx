import { FeatureLike } from 'ol/Feature';
import React from 'react';

import { ArrayDataFrame, DataFrame } from '@grafana/data';

import { DataHoverView } from './DataHoverView';

type Props = {
  feature?: FeatureLike;
  limitFields: string[];
};

export const DataHoverRow = ({ feature, limitFields }: Props) => {
  let data: DataFrame;
  let rowIndex = 0;
  if (!feature) {
    return null;
  }

  data = feature.get('frame');
  if (data) {
    rowIndex = feature.get('rowIndex');
  } else {
    const { geometry, ...properties } = feature.getProperties();
    data = new ArrayDataFrame([properties]);
  }

  return <DataHoverView data={data} rowIndex={rowIndex} limitFields={limitFields} />;
};
