const width = 800, height = 800;

const svg = d3.select("#map")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoOrthographic()
    .scale(350)
    .translate([width / 2, height / 2])
    .rotate([30, -55])
    .clipAngle(90);

const path = d3.geoPath().projection(projection);

// Draw ocean as a circle
const ocean = svg.append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale())
    .attr("fill", "#0000ff");

// Load world data
d3.json("https://d3js.org/world-110m.v1.json").then(world => {
    const land = svg.append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("fill", "#008000")
        .attr("stroke", "black")
        .attr("d", path);

    // Check if a point is visible on the front side of the globe
    function isVisible([lon, lat]) {
        const rotated = d3.geoRotation(projection.rotate())([lon, lat]);
        return rotated[0] > -90 && rotated[0] < 90;  // Visible if longitude is in this range
    }

    let showHamburg = true;

    const hamburgCoords = [10.00, 53.55];
    const [x, y] = projection(hamburgCoords);

    const hamburgDot = svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .attr("fill", "#00ffff");

    if (!isVisible(hamburgCoords)) {
        hamburgDot.style("display", "none");
    }

    // Rotation Logic
    let lastX, lastY;

    svg.call(
        d3.drag()
            .on("start", (event) => {
                lastX = event.x;
                lastY = event.y;
            })
            .on("drag", (event) => {
                const dx = event.x - lastX;
                const dy = event.y - lastY;
                const currentRotation = projection.rotate();
                projection.rotate([currentRotation[0] + dx / 4, currentRotation[1] - dy / 4]);

                // Redraw features
                land.attr("d", path);
                const [xNew, yNew] = projection(hamburgCoords);

                hamburgDot.attr("cx", xNew).attr("cy", yNew).style("display", isVisible(hamburgCoords) && showHamburg ? "block" : "none");

                lastX = event.x;
                lastY = event.y;
            })
    );

    // Dynamic Controls
    document.getElementById("landColor").addEventListener("input", (e) => {
        land.attr("fill", e.target.value);
    });

    document.getElementById("oceanColor").addEventListener("input", (e) => {
        ocean.attr("fill", e.target.value);
    });

    document.getElementById("hamburgColor").addEventListener("input", (e) => {
        hamburgDot.attr("fill", e.target.value);
    });

    document.getElementById("showHamburg").addEventListener("change", (e) => {
        showHamburg = e.target.checked;
        hamburgDot.style("display", isVisible(hamburgCoords) && showHamburg ? "block" : "none");
    });


    document.getElementById("showOutlines").addEventListener("change", (e) => {
        land.attr("stroke", e.target.checked ? "black" : "none");
    });

    // SVG Download
    document.getElementById("downloadSvg").addEventListener("click", () => {
        const svgData = new XMLSerializer().serializeToString(document.getElementById("map"));
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "globe.svg";
        link.click();

        URL.revokeObjectURL(url);
    });
});
