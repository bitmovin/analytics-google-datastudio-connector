function getDimensions() {
  if(this.dimensions === undefined) {
    this.dimensions = ['AD',
                       'ANALYTICS_VERSION',
                       'ASN',
                       'AUDIO_BITRATE',
                       'AUTOPLAY',
                       'BROWSER',
                       'BROWSER_VERSION_MAJOR',
                       'BUFFERED',
                       'CDN_PROVIDER',
                       'CITY',
                       'CLIENT_TIME',
                       'COUNTRY',
                       'CUSTOM_DATA_1',
                       'CUSTOM_DATA_2',
                       'CUSTOM_DATA_3',
                       'CUSTOM_DATA_4',
                       'CUSTOM_DATA_5',
                       'CUSTOM_USER_ID',
                       'DEVICE_TYPE',
                       'DOMAIN',
                       'DRM_LOAD_TIME',
                       'DRM_TYPE',
                       'DROPPED_FRAMES',
                       'DURATION',
                       'ERROR_CODE',
                       'EXPERIMENT_NAME',
                       'IMPRESSION_ID',
                       'IP_ADDRESS',
                       'IS_CASTING',
                       'IS_LIVE',
                       'IS_MUTED',
                       'ISP',
                       'LANGUAGE',
                       'LICENSE_KEY',
                       'MPD_URL',
                       'M3U8_URL',
                       'PATH',
                       'PAUSED',
                       'PLAYED',
                       'PLAYER',
                       'PLAYER_KEY',
                       'PLAYER_STARTUPTIME',
                       'PLAYER_TECH',
                       'PLAYER_VERSION',
                       'REGION',
                       'SCALE_FACTOR',
                       'SCREEN_HEIGHT',
                       'SCREEN_WIDTH',
                       'SEEKED',
                       'SIZE',
                       'STARTUPTIME',
                       'STREAM_FORMAT',
                       'USER_ID',
                       'VIDEO_BITRATE',
                       'VIDEO_DURATION',
                       'VIDEO_ID',
                       'VIDEO_PLAYBACK_HEIGHT',
                       'VIDEO_PLAYBACK_WIDTH',
                       'VIDEO_STARTUPTIME',
                       'VIDEO_WINDOW_HEIGHT',
                       'VIDEO_WINDOW_WIDTH',
                       'VIDEOTIME_END',
                       'VIDEOTIME_START',
                       'OPERATINGSYSTEM',
                       'OPERATINGSYSTEM_VERSION_MAJOR',
                       'PAGE_LOAD_TIME',
                       'PAGE_LOAD_TYPE',
                       'PROG_URL']; 
  }
  return this.dimensions;
}

function isAdminUser() {
  return true;
}

function getAuthType() {
  return {
    type: 'NONE'
  };
}

function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();

//  config.newInfo()
//    .setId('instructions')
//    .setText('Enter your API key.');
  
  config.newTextInput()
    .setId('apiKey')
    .setName('Enter your API key');
  
  config.newTextInput()
    .setId('licenseKey')
    .setName('Enter your license key');
  
  config.newSelectSingle()
    .setId('aggregation')
    .setName('Aggregation')
    .setHelpText('Select a aggregation')
    .setAllowOverride(true)
    .addOption(config.newOptionBuilder().setLabel('Count').setValue('count'))
    .addOption(config.newOptionBuilder().setLabel('Sum').setValue('sum'))
    .addOption(config.newOptionBuilder().setLabel('Avg').setValue('avg'))
    .addOption(config.newOptionBuilder().setLabel('Min').setValue('min'))
    .addOption(config.newOptionBuilder().setLabel('Max').setValue('max'))
    .addOption(config.newOptionBuilder().setLabel('Stddev').setValue('stddev'))
    .addOption(config.newOptionBuilder().setLabel('Percentile').setValue('percentile'))
    .addOption(config.newOptionBuilder().setLabel('Variance').setValue('variance'))
    .addOption(config.newOptionBuilder().setLabel('Median').setValue('median'));
  
  const dimensionSelect = config.newSelectSingle()
    .setId('dimension')
    .setName('Dimension')
    .setHelpText('Select a dimension')
    .setAllowOverride(true);
  
  getDimensions().forEach(function(dimension) {
    dimensionSelect.addOption(config.newOptionBuilder().setLabel(dimension).setValue(dimension));
  });
    
  config.newTextInput()
  .setId('filter')
  .setName('Filter')
  .setPlaceholder('{name:"STARTUPTIME","operator":"GT","value":0}')
  .setAllowOverride(true);

  config.setDateRangeRequired(true);
  
  return config.build();
}

function getFields(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;
  
  fields.newMetric()
    .setId('dimension')
    .setName('Dimension')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields.newDimension()
    .setId('interval_HOUR')
  .setName('Hour')
  .setType(types.YEAR_MONTH_DAY_HOUR);

  fields.newDimension()
    .setId('interval_DAY')
  .setName('Day')
  .setType(types.YEAR_MONTH_DAY);

  fields.newDimension()
    .setId('interval_MONTH')
  .setName('Month')
  .setType(types.YEAR_MONTH);

  getDimensions().forEach(function(dimension) {
    fields.newDimension()
    .setId('groupBy_' + dimension)
    .setName(dimension)
    .setType(types.TEXT)
    .setGroup('Group By');
  });

  return fields;
}

function getSchema(request) {
  var fields = getFields(request).build();
  return { schema: fields };
}

function formatMillis(millis, type) {
  var types = DataStudioApp.createCommunityConnector().FieldType;
  var date = new Date(millis);
  var formattedDate = String(date.getFullYear()).concat("0".concat(date.getMonth() + 1).slice(-2));
  if(type === types.YEAR_MONTH) {
    return formattedDate;
  }
  formattedDate = formattedDate.concat("0".concat(date.getDate()).slice(-2));
  if(type === types.YEAR_MONTH_DAY_HOUR) {
    formattedDate = formattedDate.concat("0".concat(date.getHours()).slice(-2));
  }
  return formattedDate;
}

function responseToRows(requestedFields, response, groupBy) {
  const fields = requestedFields.asArray();
  var groupByStartIndex = 0;
  fields.forEach(function(field) {
    if(field.getId().indexOf('interval_') === 0) {
      groupByStartIndex = 1;
    }
  });
  
  return response.map(function(row) {
    var result = [];
    fields.forEach(function (field) {
      const id = field.getId();
      if(id === 'dimension') {
        return result.push(row[row.length - 1]);        
      }
      else if(id.indexOf('interval_') === 0) {
        return result.push(formatMillis(row[0], field.getType()));        
      }
      else if(id.indexOf('groupBy_') === 0) {
        var index = groupBy.indexOf(id.replace('groupBy_', '')) + groupByStartIndex;
        result.push(row[index]);
        return;
      }
      return result.push('');
    });
    return { values: result };
  });
}

function testGetData() {
  getData({ fields: [{'name': 'dimension'}, {name: 'interval_HOUR'}, {name: 'groupBy_DEVICE_TYPE'}, {name: 'groupBy_BROWSER'}],
           dateRange: {
             startDate: '2018-12-01',
             endDate: '2018-12-10'
           },
           configParams: {
             interval: 'DAY',
             aggregation: 'count',
             dimension: 'IMPRESSION_ID',
             groupBy: 'BROWSER, OPERATINGSYSTEM'
           }}); 
}

function getData(request) {
//  throw new Error(JSON.stringify(request));
  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields(request).forIds(requestedFieldIds);

  var url = [
    'https://api.bitmovin.com/v1/analytics/queries/',
    request.configParams.aggregation
    ];
  
  var data = {
    orderBy:[],
    groupBy:[],
    dimension: request.configParams.dimension,
    licenseKey: request.configParams.licenseKey, //45adcf9b-8f7c-4e28-91c5-50ba3d442cd4
    start: request.dateRange.startDate,
    end:request.dateRange.endDate
  };

  if (request.configParams.filter) {
    data.filters = eval('(' + request.configParams.filter + ')');
  }

  const intervalRanks = ['HOUR', 'DAY', 'MONTH'];

  requestedFields.asArray().forEach(function(field) {
    const id = field.getId();
    if(id.indexOf('interval_') === 0) {
      const interval = id.replace('interval_', '');
      if(!data.interval || intervalRanks.indexOf(interval) < intervalRanks.indexOf(data.interval)) {
        data.interval = interval;
      }
    }
  });

  requestedFields.asArray().forEach(function(field) {
    const id = field.getId();
    if(id.indexOf('groupBy_') === 0) {
      data.groupBy.push(id.replace('groupBy_', ''));
    }
  });
  
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'headers': {
      'x-api-key': request.configParams.apiKey//0b91f6ba-82f7-4d20-a827-09cdf6e15adc
    },
    'payload' : JSON.stringify(data)
  };
  
  var rows = [];

  var response = UrlFetchApp.fetch(url.join(''), options);
  var parsedJson = JSON.parse(response);

  if(parsedJson.data && parsedJson.data.result && parsedJson.data.result.rows) {
    rows = responseToRows(requestedFields, parsedJson.data.result.rows, data.groupBy);
  }
  
  var result = {
    schema: requestedFields.build(),
    rows: rows
  };
  
  return result;

}