function buildMetadata(sample) {

 	//console.log(`test: ${sample}`); 
	
	var url = (`/metadata/${sample}`);
	//console.log(`url:  ${url}`);

	// Use d3 to select the panel with id of `#sample-metadata`
	var panel = d3.select("#sample-metadata");
	
	// Use d3 to select the panel with id of `#sample-metadata`
	panel.html("");
	
	// Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
	d3.json(url).then(function(response) {
		//console.log(response);
		
	    // Use `Object.entries` to add each key and value pair to the panel
		Object.entries(response).forEach(function([key, value]) {
			//console.log(key, value);
			var p1 = d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
		 
		 });

		
	});
	
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
	
	console.log(`test chart: ${sample}`);
	
	var chartUrl = (`/samples/${sample}`);
	console.log(`chartUrl:  ${chartUrl}`);
	
	// data return from json call is already sorted 
	d3.json(chartUrl).then(function(response) {
		//console.log(response);
		
		// Slice the first 10 objects for plotting
        //data = response.slice(0, 10);
		top_labels = response.otu_ids.slice(0, 10);
		top_values = response.sample_values.slice(0, 10);
		top_text = response.otu_labels.slice(0, 10);
		//console.log(top_labels);
		//console.log(top_values);
		
	//Build a Pie Chart with top 10 samples
	var data = [{
		"labels": top_labels,
        "values": top_values,
		"text" :top_text,
		"hoverinfo": top_text,
        "type": "pie"}];
	var layout = {
		title: "Top 10 Biodiversity Samples"  };
		
    Plotly.plot("pie", data, layout);
	
	// Build a Bubble Chart using the sample data
	// Use `otu_ids` for the x values
	// Use `sample_values` for the y values
	// Use `sample_values` for the marker size
	// Use `otu_ids` for the marker colors
	// Use `otu_labels` for the text values

		labels = response.otu_ids;
		values = response.sample_values;
		text = response.otu_labels;
		
	var bData = [{
		x : labels,
		y : values,
		mode: 'markers',
		marker: { size : values,
		          color : labels},
		text : text
	}];
	
	var blayout = { 
	    title: 'Biodiversity Bubble Chart'
 
    };
	
	Plotly.newPlot('bubble', bData, blayout);
	
	});
		
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
	//console.log(sampleNames[0]);
	//console.log(sampleNames);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
