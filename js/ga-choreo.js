getMetricsInputs.set_Filters("ga:source==t.co")
getMetricsInputs.set_EndDate("2013-09-11")
getMetricsInputs.set_StartDate("2013-08-01")
getMetricsInputs.set_Metrics("ga:visits")
getMetricsInputs.set_Dimensions("ga:fullReferrer,ga:dateHour")
getMetricsInputs.set_ProfileId("75218327")

getMetricsChoreo.execute(
    getMetricsInputs,
    function(results){
    	console.log(results.get_Bounces());
    },
    function(error){
    	console.log(error.type); console.log(error.message);
    }
);

exports.getMetricsChoreo = getMetricsChoreo;