// Copyright 2019, bitmovin GmbH

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Returns the available dimensions the user can use to query or group the API results.
 *
 * @returns {Array} Array of the available dimensions.
 */
function getDimensions() {
  if (this.dimensions === undefined) {
    this.dimensions = [
      "AD",
      "ANALYTICS_VERSION",
      "ASN",
      "AUDIO_BITRATE",
      "AUTOPLAY",
      "BROWSER",
      "BROWSER_VERSION_MAJOR",
      "BUFFERED",
      "CDN_PROVIDER",
      "CITY",
      "CLIENT_TIME",
      "COUNTRY",
      "CUSTOM_DATA_1",
      "CUSTOM_DATA_2",
      "CUSTOM_DATA_3",
      "CUSTOM_DATA_4",
      "CUSTOM_DATA_5",
      "CUSTOM_DATA_6",
      "CUSTOM_DATA_7",
      "CUSTOM_DATA_8",
      "CUSTOM_DATA_9",
      "CUSTOM_DATA_10",
      "CUSTOM_DATA_11",
      "CUSTOM_DATA_12",
      "CUSTOM_DATA_13",
      "CUSTOM_DATA_14",
      "CUSTOM_DATA_15",
      "CUSTOM_DATA_16",
      "CUSTOM_DATA_17",
      "CUSTOM_DATA_18",
      "CUSTOM_DATA_19",
      "CUSTOM_DATA_20",
      "CUSTOM_DATA_21",
      "CUSTOM_DATA_22",
      "CUSTOM_DATA_23",
      "CUSTOM_DATA_24",
      "CUSTOM_DATA_25",
      "CUSTOM_DATA_26",
      "CUSTOM_DATA_27",
      "CUSTOM_DATA_28",
      "CUSTOM_DATA_29",
      "CUSTOM_DATA_30",
      "CUSTOM_USER_ID",
      "DEVICE_CLASS",
      "DEVICE_TYPE",
      "DOMAIN",
      "DRM_LOAD_TIME",
      "DRM_TYPE",
      "DROPPED_FRAMES",
      "DURATION",
      "ERROR_CODE",
      "EXPERIMENT_NAME",
      "IMPRESSION_ID",
      "IP_ADDRESS",
      "ISP",
      "IS_CASTING",
      "IS_LIVE",
      "IS_MUTED",
      "LANGUAGE",
      "LICENSE_KEY",
      "M3U8_URL",
      "MPD_URL",
      "OPERATINGSYSTEM",
      "OPERATINGSYSTEM_VERSION_MAJOR",
      "PAGE_LOAD_TIME",
      "PAGE_LOAD_TYPE",
      "PATH",
      "PAUSED",
      "PLAYED",
      "PLAYER",
      "PLAYER_KEY",
      "PLAYER_STARTUPTIME",
      "PLAYER_TECH",
      "PLAYER_VERSION",
      "PROG_URL",
      "REGION",
      "SCALE_FACTOR",
      "SCREEN_HEIGHT",
      "SCREEN_WIDTH",
      "SEEKED",
      "SIZE",
      "STARTUPTIME",
      "STREAM_FORMAT",
      "USER_ID",
      "VIDEOTIME_END",
      "VIDEOTIME_START",
      "VIDEO_BITRATE",
      "VIDEO_DURATION",
      "VIDEO_ID",
      "VIDEO_PLAYBACK_HEIGHT",
      "VIDEO_PLAYBACK_WIDTH",
      "VIDEO_STARTUPTIME",
      "VIDEO_TITLE",
      "VIDEO_WINDOW_HEIGHT",
      "VIDEO_WINDOW_WIDTH"
    ].concat(getMetrics());
  }
  return this.dimensions;
}

/**
 * Returns the available aggregations the user can use to query API results.
 *
 * @returns {Array} Array of the available aggregations.
 */
function getAggregations() {
  if (this.aggregations == null) {
    this.aggregations = [
      { label: "Count", value: "count" },
      { label: "Sum", value: "sum" },
      { label: "Avg", value: "avg" },
      { label: "Min", value: "min" },
      { label: "Max", value: "max" },
      { label: "Stddev", value: "stddev" },
      { label: "Percentile", value: "percentile" },
      { label: "Variance", value: "variance" },
      { label: "Median", value: "median" },
      { label: "Metrics", value: "metrics" }
    ];
  }
  return this.aggregations;
}

/**
 * Returns the available metrics the user can use to query API results for the metrics dimension.
 *
 * @returns {Array} Array of the available metrics.
 */
function getMetrics() {
  if (this.metrics == null) {
    this.metrics = ["MAX_CONCURRENTVIEWERS", "AVG_CONCURRENTVIEWERS"];
  }
  return this.metrics;
}

/**
 * This checks whether the current user is an admin user of the connector.
 *
 * @returns {boolean} Returns true if the current authenticated user at the time
 * of function execution is an admin user of the connector. If the function is
 * omitted or if it returns false, then the current user will not be considered
 * an admin user of the connector.
 */
function isAdminUser() {
  return false;
}

/**
 * Returns the authentication method required by the connector to authorize the
 * third-party service.
 *
 * @returns {Object} `AuthType` used by the connector.
 */
function getAuthType() {
  return {
    type: "NONE"
  };
}

/**
 * Returns the user configurable options for the connector.
 *
 * @param {Object} request Config request parameters.
 * @returns {Object} Connector configuration to be displayed to the user.
 */
function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();

  config
    .newTextInput()
    .setId("apiKey")
    .setName("Enter your API key");

  config
    .newTextInput()
    .setId("tenantOrgId")
    .setName("Enter the tenant organization ID, if applicable");

  config
    .newTextInput()
    .setId("licenseKey")
    .setName("Enter your license key");

  config
    .newTextInput()
    .setId("timezone")
    .setPlaceholder("+02:00")
    .setName("Enter your Timezone");

  const aggregationSelect = config
    .newSelectSingle()
    .setId("aggregation")
    .setName("Aggregation")
    .setHelpText("Select an aggregation")
    .setAllowOverride(true);

  getAggregations().forEach(function(aggregation) {
    aggregationSelect.addOption(
      config
        .newOptionBuilder()
        .setLabel(aggregation.label)
        .setValue(aggregation.value)
    );
  });

  config
    .newTextInput()
    .setId("percentile")
    .setName("Percentile")
    .setHelpText("Percentile (0-99)")
    .setPlaceholder("Percentile (0-99)")
    .setAllowOverride(true);

  const dimensionSelect = config
    .newSelectSingle()
    .setId("dimension")
    .setName("Dimension")
    .setHelpText("Select a dimension")
    .setAllowOverride(true);

  getDimensions().forEach(function(dimension) {
    dimensionSelect.addOption(
      config
        .newOptionBuilder()
        .setLabel(dimension)
        .setValue(dimension)
    );
  });

  config
    .newTextInput()
    .setId("filter")
    .setName("Filter")
    .setPlaceholder(
      '{"name":"STARTUPTIME","operator":"GT","value":0}, {"name":"PLAYED","operator":"GT","value":0}'
    )
    .setHelpText("Filter API results")
    .setAllowOverride(true);

  config
    .newTextInput()
    .setId("orderBy")
    .setName("Order By")
    .setPlaceholder(
      '{"name":"COUNTRY","order":"DESC"}, {"name":"STARTUPTIME","order":"ASC"}'
    )
    .setHelpText("Set ordering of API results by dimension and direction")
    .setAllowOverride(true);

  config
    .newTextInput()
    .setId("limit")
    .setName("Limit")
    .setHelpText("Maximum number of rows returned (max. 150)")
    .setPlaceholder("150")
    .setAllowOverride(true);

  config
    .newTextInput()
    .setId("offset")
    .setName("Offset")
    .setHelpText("Offset of data")
    .setPlaceholder("0")
    .setAllowOverride(true);

  config.setDateRangeRequired(true);

  return config.build();
}

/**
 * Returns the fields for the connector.
 *
 * @returns {Object} The fields for the connector.
 */
function getFields(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields
    .newMetric()
    .setId("dimension")
    .setName("Dimension")
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newDimension()
    .setId("interval_HOUR")
    .setName("Hour")
    .setType(types.YEAR_MONTH_DAY_HOUR);

  fields
    .newDimension()
    .setId("interval_DAY")
    .setName("Day")
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId("interval_MONTH")
    .setName("Month")
    .setType(types.YEAR_MONTH);

  getDimensions().forEach(function(dimension) {
    fields
      .newDimension()
      .setId("groupBy_" + dimension)
      .setName(dimension)
      .setType(types.TEXT)
      .setGroup("Group By");
  });

  return fields;
}

/**
 * Returns the schema for the given request.
 *
 * @param {Object} request Schema request parameters.
 * @returns {Object} Schema for the given request.
 */
function getSchema(request) {
  validateConfig(request.configParams);

  var fields = getFields(request).build();
  return { schema: fields };
}

/**
 * Formats the supplied Unix timestamp in millis as a date string,
 * depending on the type that is provided as the second parameter.
 *
 * @param {Number} millis Unix timestamp in millis.
 * @param {FieldType} type Format of the string that will be returned.
 * @returns {String} A date string according to the type provided.
 */
function formatMillis(millis, type, timezone) {
  var types = DataStudioApp.createCommunityConnector().FieldType;
  var timezoneMinutes = convertTimezoneToMinutesOffset(timezone)
  var millisOffset = millis
  if (timezoneMinutes != null) {
    millisOffset += (timezoneMinutes * 60 * 1000)
  }
  var date = new Date(millisOffset).toISOString();
  var result = date.slice(0, 4) + date.slice(5, 7);
  if (type === types.YEAR_MONTH) return result;
  result = result.concat(date.slice(8, 10));
  if (type === types.YEAR_MONTH_DAY) return result;
  return result.concat(date.slice(11, 13));
}

/**
 * Formats the parsed response from external data source into correct tabular
 * format and returns only the requestedFields.
 *
 * @param {Object} requestedFields The fields requested in the getData request.
 * @param {Array} response An array of rows returned from the Bitmovin API.
 * @param {Array} groupBy An array of dimensions that have been used to group the data.
 * @returns {Array} Array containing rows of data according to the requested fields.
 */
function responseToRows(requestedFields, response, groupBy, timezone) {
  const fields = requestedFields.asArray();
  var groupByStartIndex = 0;
  fields.forEach(function(field) {
    if (field.getId().indexOf("interval_") === 0) {
      groupByStartIndex = 1;
    }
  });

  return response.map(function(row) {
    var result = [];
    fields.forEach(function(field) {
      const id = field.getId();
      if (id === "dimension") {
        return result.push(row[row.length - 1]);
      } else if (id.indexOf("interval_") === 0) {
        return result.push(formatMillis(row[0], field.getType(), timezone));
      } else if (id.indexOf("groupBy_") === 0) {
        var index =
          groupBy.indexOf(id.replace("groupBy_", "")) + groupByStartIndex;
        result.push(String(row[index]));
        return;
      }
      return result.push("");
    });
    return { values: result };
  });
}

/**
 * Validates config parameters if the selected aggregation and dimension are valid.
 *
 * @param {Object} configParams Config parameters from `request`.
 * @throws An exception if the config is invalid
 */
function validateAggregationAndDimension(configParams) {
  const isMetric = getMetrics().indexOf(configParams.dimension) !== -1;
  if (configParams.aggregation === "metrics" && !isMetric) {
    const prettyMetricsText = JSON.stringify(getMetrics());
    throw new Error(
      "If you choose `Metrics` as aggregation, the selected dimension must be one of " +
        prettyMetricsText
    );
  } else if (configParams.aggregation !== "metrics" && isMetric) {
    throw new Error(
      "You have to choose `Metrics` as aggregation for this dimension"
    );
  }
}

/**
 * Validates config parameters and displays an error if the config is invalid.
 *
 * @param {Object} configParams Config parameters from `request`.
 */
function validateConfig(configParams) {
  configParams = configParams || {};
  try {
    if (!configParams.aggregation) {
      throw new Error("Aggregation is required.");
    }
    if (!configParams.dimension) {
      throw new Error("Dimension is required.");
    }
    if (!configParams.licenseKey) {
      throw new Error("License key is required.");
    }
    if (convertTimezoneToMinutesOffset(configParams.timezone) == null) {
      throw new Error("Timezone format is invalid")
    }
    if (!configParams.apiKey) {
      throw new Error("API key is required.");
    }

    if (configParams.limit && isNaN(parseInt(configParams.limit))) {
      throw new Error("Limit has to be a numeric value.");
    }

    if (configParams.offset && isNaN(parseInt(configParams.offset))) {
      throw new Error("Offset has to be a numeric value.");
    }

    if (configParams.aggregation === "percentile") {
      var percentile = parseInt(configParams.percentile);
      if (isNaN(percentile) || percentile < 0 || percentile > 100) {
        throw new Error(
          "You have to set the percentile to a value between 0 and 99."
        );
      }
    }
    validateAggregationAndDimension(configParams);
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setText(e.message)
      .throwException();
  }
}

/**
 * converts a timezone string into the minute representation of it
 * @param {string} timezone
 * @returns {number | null} timezone in minutes or null if invalid
 */
 function convertTimezoneToMinutesOffset(timezone) {
  if (timezone == null || timezone.length == 0) {
    return 0;
  }
  var tz = timezone;
  if (tz.indexOf("+") != 0 && tz.indexOf("-") != 0) {
    tz = "+" + tz;
  }
  var regex = /([+-])([0-9]{2}):([0-9]{2})\b/.exec(tz);
  if (regex == null) {
    return null;
  }
  var hours = parseInt(regex[2].replace(/([0])(?=.)/, ''));
  var min = parseInt(regex[3].replace(/([0])(?=.)/, ''));
  var timezoneMinutes = hours * 60 + min;
  if (regex[1] != "+") {
    timezoneMinutes *= -1;
  }
  return timezoneMinutes;
}

/**
 * Returns the analytics request URL based on the request configuration.
 *
 * @param {Object} request Data request parameters.
 * @returns {String} Correct analytics request URL.
 */
function getAnalyticsRequestUrl(request) {
  if (getMetrics().indexOf(request.configParams.dimension) !== -1) {
    return [
      "https://api.bitmovin.com/v1/analytics/metrics/",
      request.configParams.dimension
    ];
  }
  return [
    "https://api.bitmovin.com/v1/analytics/queries/",
    request.configParams.aggregation
  ];
}

/**
 * Returns the tabular data for the given request.
 *
 * @param {Object} request Data request parameters.
 * @returns {Object} Contains the schema and data for the given request.
 */
function getData(request) {
  var configParams = request.configParams;
  validateConfig(configParams);

  var requestedFieldIds = request.fields.map(function(field) {
    return field.name;
  });
  var requestedFields = getFields(request).forIds(requestedFieldIds);

  var url = getAnalyticsRequestUrl(request);

  var data = {
    orderBy: [],
    groupBy: [],
    dimension: configParams.dimension,
    licenseKey: configParams.licenseKey,
    start: request.dateRange.startDate + "T00:00:00.000Z",
    end: request.dateRange.endDate + "T23:59:59.000Z"
  };

  if (configParams.filter) {
    data.filters = JSON.parse("[" + configParams.filter + "]");
  }

  if (configParams.orderBy) {
    data.orderBy = JSON.parse("[" + configParams.orderBy + "]");
  }

  if (configParams.limit) {
    data.limit = configParams.limit;
  }

  if (configParams.offset) {
    data.offset = configParams.offset;
  }

  if (configParams.aggregation === "percentile") {
    data.percentile = configParams.percentile;
  }

  const intervalRanks = ["HOUR", "DAY", "MONTH"];

  requestedFields.asArray().forEach(function(field) {
    const id = field.getId();
    if (id.indexOf("interval_") === 0) {
      const interval = id.replace("interval_", "");
      if (
        !data.interval ||
        intervalRanks.indexOf(interval) < intervalRanks.indexOf(data.interval)
      ) {
        data.interval = interval;
      }
    }
  });

  requestedFields.asArray().forEach(function(field) {
    const id = field.getId();
    if (id.indexOf("groupBy_") === 0) {
      data.groupBy.push(id.replace("groupBy_", ""));
    }
  });

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": configParams.apiKey
    },
    payload: JSON.stringify(data),
    muteHttpExceptions: true
  };

  const tenantId = request.configParams.tenantOrgId;

  if (tenantId) {
    options["headers"]["x-tenant-org-id"] = tenantId;
  }

  var rows = [];

  try {
    var response = UrlFetchApp.fetch(url.join(""), options);
    var parsedJson = JSON.parse(response.getContentText());

    if (response.getResponseCode() === 200) {
      if (
        parsedJson.data &&
        parsedJson.data.result &&
        parsedJson.data.result.rows
      ) {
        rows = responseToRows(
          requestedFields,
          parsedJson.data.result.rows,
          data.groupBy,
          configParams.timezone
        );
      }
    } else {
      var errorMessage =
        parsedJson.data && parsedJson.data.message
          ? parsedJson.data.message
          : "Unknown error.";
      DataStudioApp.createCommunityConnector()
        .newUserError()
        .setDebugText(
          "Error fetching data from API. Response: " + response.getContentText()
        )
        .setText(
          "There was an error querying the Bitmovin API: " + errorMessage
        )
        .throwException();
    }
  } catch (e) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText("Error fetching data from API. Exception details: " + e)
      .setText("An unknown error occured while querying the Bitmovin API.")
      .throwException();
  }

  var result = {
    schema: requestedFields.build(),
    rows: rows
  };

  return result;
}
