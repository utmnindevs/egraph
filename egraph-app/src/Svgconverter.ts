import { SVG } from '@svgdotjs/svg.js';

interface EdgeProps{
    color: string,
    width: number,
    linecap: string,
    linejoin: string,
    marker_height: number,
    marker_width: number
}

interface NodeProps{
    color: string,
    stroke_color: string,
    stroke_width: number,
    border_radius: number,
    height: number,
    width: number
}

interface TextProps{
    family: string,
    size: number,
    color: string
}

interface SvgProps{
    edge_props: EdgeProps
    node_props: NodeProps
    text_props: TextProps
}

export function svgConverterFunction(gd: any, props: SvgProps) {
    // var draw = SVG().attr('viewBox', '0 0 100% 100%').attr('height', '100%').attr('width', '100%').attr('preserveAspectRatio', 'none');
    var draw = SVG().size(600, 180).viewbox(0, 0, 600, 180)

    var arrow = draw.marker(10, 10, function (add) {
        add.path('M0,0 L0,10 L10,5 z').fill('black');
    });

    gd.edges().forEach(function (e: any) {
        var points:any = [];
        gd.edge(e).points.forEach((p: any) => {
            points.push(p.x, p.y);
        });
        draw.polyline(points)
            .fill('none')
            .stroke({ color: 'black', width: 1, linecap: 'round', linejoin: 'round' })
            .marker('end', arrow);
        console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(gd.edge(e)));
    });

    gd.nodes().forEach(function (v:any) {
        var node = gd.node(v);
        if (node && typeof node.x !== 'undefined' && typeof node.y !== 'undefined') {
            var rect = draw.rect(50, 50)
                .attr('x', node.x - 24)
                .attr('y', node.y - 24)
                .fill('white')
                .stroke({ color: 'black', width: 1 })
                .radius(5);

            draw.text(function (add) {
                add.tspan(node.label.toString())
                    .attr('x', node.x)
                    .attr('y', node.y)
                    .font({ family: 'Roboto', size: 10, anchor: 'middle' }) // Использование шрифта Roboto
                    .fill('black');
            });

            console.log("Node " + v + ": " + JSON.stringify(node));
        } else {
            console.error(`Node ${v} is missing coordinates`, node);
        }
    });

    var svg = draw.svg();
    return svg;
}
