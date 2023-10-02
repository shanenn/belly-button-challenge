function setDropDown(names) {
    // Populat dropdown with json names data
    let idNum = ''
    let dMenu = d3.select("#selDataset")
    for (i=0;i<names.length;i++) {
        idNum = names[i]
        newEle = dMenu.append('option')
        newEle.text(idNum)
        newEle.property('value',i)
    };

};

function setPlots(dataFull,id=0) {
    let samples = dataFull['samples']
    let info = dataFull['metadata']
    // Initialize Bar Chart Use 0
    let barY = []
    for (i=0;i<10;i++) {
        barY.push(`OTU ${samples[id].otu_ids[i]}`)
    };
    data = [{
        x: samples[id].sample_values.slice(0,10).reverse(),
        y: barY.reverse(),
        text: samples[id].otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h'}];
    layout = {
        title: 'Top Samples (Up to 10)',
        height: 750,
        width: 500,
    };
    Plotly.newPlot("bar", data,layout);

    // Initialize bubble chart Use 0
    data = [{
        x: samples[id].otu_ids,
        y: samples[id].sample_values,
        marker: { size: samples[id].sample_values,
        color: samples[id].otu_ids,
        colorscale: 'Earth'},
        text: samples[id].otu_labels,
        mode: 'markers'}];
    layout = {xaxis: {
        title: 'OTU ID'},
        height: 500,
        width: 1250,
        };
    Plotly.newPlot("bubble", data,layout);

    // Initialize Gauge Use 0
    // Use Scatter to initialize plot and set center, pie to create gauge
    data = [{ type: 'scatter',
    x: [0], y:[0],
        marker: {size: 16, color:'850000'},
        showlegend: false,
        hoverinfo: 'none'
    },
    { 
    type: 'pie',
    hole: .5,
    direction: "clockwise",
    rotation: 90,
    textinfo: 'text',
    textposition:'inside', 
    values: [50, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9],
    text: [' ', '0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],

    marker: {
        colors: ['white',
            'rgba(248, 243, 236, 1)',
            'rgba(244, 241, 228, 1)',
            'rgba(233, 230, 201, 1)',
            'rgba(229, 232, 176, 1)',
            'rgba(213, 229, 153, 1)',
            'rgba(183, 205, 143, 1)',
            'rgba(138, 192, 134, 1)',
            'rgba(137, 188, 141, 1)',
            'rgba(132, 181, 137, 1)'
        ]
    },
    hoverinfo: 'none',

    showlegend: false
    }];

    // Calculate Path (point from center to wfreq relative to circle)
    let degrees = 180-20*parseFloat(info[id]['wfreq']),
        radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let path = `M -.0 -0.035 L .0 0.035 L ${String(x)} ${String(y)} Z`;

    // Incorporate path and create shape
    layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }],
    title: 'Wash Frequency',
    font: {size: 27},
    height: 750,
    width: 650,
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge',data,layout)


};

function setInfo(info,id=0) {
    // Initialize metadata
    tb = d3.select('.panel-body').append('p')
    lines = tb.html(`id: ${info[id]['id']}<br>
    ethnicity: ${info[id]['ethnicity']}<br>
    gender: ${info[id]['gender']}<br>
    age: ${info[id]['age']}<br>
    location: ${info[id]['location']}<br>
    bbtype: ${info[id]['bbtype']}<br>
    wfreq: ${info[id]['wfreq']}`)
    lines.style('font-size','90%')

};

function resetPlots(samples,id=0) {
    // Reset bar chart
    points = 10
    if (samples[id].sample_values.length < 10) {
        points = samples[id].sample_values.length
    };

    let barY = []
    for (i=0;i<points;i++) {
        barY.push(`OTU ${samples[id].otu_ids[i]}`)

    };
    Plotly.restyle("bar", 'x',[samples[id].sample_values.slice(0,points).reverse()]);
    Plotly.restyle("bar", 'y',[barY.reverse()]);
    Plotly.restyle("bar", 'text',[samples[id].otu_labels.slice(0,points).reverse()]);

    // Reset bubble chart
    Plotly.restyle("bubble", 'x', [samples[id].otu_ids]);
    Plotly.restyle("bubble", 'y', [samples[id].sample_values]);
    Plotly.restyle("bubble", 'marker',[{ size: samples[id].sample_values,color: samples[id].otu_ids,colorscale: 'Earth'}]);
    Plotly.restyle("bubble", 'text', [samples[id].otu_labels]);



};

function resetInfo(info,id=0) {
    // Reset Info
    tb = d3.select('.panel-body')
    lines = tb.html(`id: ${info[id]['id']}<br>
    ethnicity: ${info[id]['ethnicity']}<br>
    gender: ${info[id]['gender']}<br>
    age: ${info[id]['age']}<br>
    location: ${info[id]['location']}<br>
    bbtype: ${info[id]['bbtype']}<br>
    wfreq: ${info[id]['wfreq']}`)
    lines.style('font-size','90%')

};

function resetPath(info,id=0) {
    // Reset and redraw path
    let degrees = 180-20*parseFloat(info[id]['wfreq']),
        radius = .5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let path = `M -.0 -0.035 L .0 0.035 L ${String(x)} ${String(y)} Z`;
    let update = {shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }]}
    Plotly.relayout('gauge',update)

};

function optionChanged() {
    const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
    samples = d3.json(url).then(function(data) {
        let samples = data['samples']
        let info = data['metadata']
        let dropdownMenu = d3.select("#selDataset");
        let id = dropdownMenu.property("value");
        resetPlots(samples,parseInt(id))
        resetInfo(info,id)
        resetPath(info,id)
    });
};

    // Start of initializing
function init() {
    const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'
    samples = d3.json(url).then(function(data) {
        let samples = data['samples']
        let info = data['metadata']
        let names = data['names']
        setPlots(data,0)
        setInfo(info,0)
        setDropDown(names)
    });
};

init()
