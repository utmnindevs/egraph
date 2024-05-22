import { SVG } from '@svgdotjs/svg.js';

export function svgConverterFunction(gd) {
    var draw = SVG().size(1000, 1000);

    var arrow = draw.marker(10, 10, function(add) {
        add.path('M0,0 L0,10 L10,5 z').fill('black');
    });

    gd.edges().forEach(function(e) {
        var points = [];
        gd.edge(e).points.forEach((p) => {
            points.push(p.x, p.y);
        });
        draw.polyline(points)
            .fill('none')
            .stroke({color: 'black', width: 1, linecap: 'round', linejoin: 'round'})
            .marker('end', arrow); 
        console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(gd.edge(e)));
    });

    gd.nodes().forEach(function(v) {
        var node = gd.node(v);
        if (node && typeof node.x !== 'undefined' && typeof node.y !== 'undefined') {
            draw.rect(30, 30)
                .attr('x', node.x - 10)
                .attr('y', node.y - 10)
                .fill('white')
                .stroke({color: 'black', width: 1})
                .radius(5);
            
            draw.text(function(add) {
                add.tspan(node.label.toString())
                    .attr('x', node.x + 5)
                    .attr('y', node.y + 7)
                    .font({family: 'Arial', size: 10, anchor: 'middle'})
                    .fill('black');
            });

            console.log("Node " + v + ": " + JSON.stringify(node));
        } else {
            console.error(`Node ${v} is missing coordinates`, node);
        }
    });

    var svg = draw.svg();
    console.log(svg);
    return svg;  
}
