import ResizableBox from "./ResizableBox";
import React, { useMemo } from "react";
import { Chart } from "react-charts";

export default function Line({ label, inputData }) {
    const { xs, ys } = inputData

    const average = (arr) => arr.length > 0 ? arr.reduce((prev, curr) => prev + curr, 0) / arr.length : 0;

    // Maximum, Minimum, and Average
    const max = Math.max(...ys);
    const min = Math.min(...ys);
    const avg = average(ys);

    const data = useMemo(
        () => [
            {
                label,
                data: [
                    ...xs.map((x, idx) => ({
                        primary: x, secondary: ys[idx]
                    })),
                ],
            },
            {
                label: 'Max value',
                data: [
                    ...xs.map((x, idx) => ({
                        primary: x, secondary: max
                    })),
                ],
            },
            {
                label: 'Min value',
                data: [
                    ...xs.map((x, idx) => ({
                        primary: x, secondary: min
                    })),
                ],
            },
            {
                label: 'Average value',
                data: [
                    ...xs.map((x, idx) => ({
                        primary: x, secondary: avg
                    })),
                ],
            },
        ],
        [xs, ys]
    );

    const primaryAxis = useMemo(() => ({
        getValue: (datum) => datum.primary,
        dataType: 'time',
        tickFormat: (value, index, values) => {
            return values.length > 10 && index % Math.floor(values.length / 10) !== 0 ? '' : (value);
        },
        // title: labels && labels.x,
    }), []);

    const secondaryAxes = useMemo(() => [
        {
            getValue: (datum) => datum.secondary,
            elementType: 'line',
            // title: labels && labels.y,
        },
    ], []);

    return (
        <>
            <h2>{label}</h2>
            <br />
            <br />
            <ResizableBox>
                <Chart
                    options={{
                        data,
                        primaryAxis,
                        secondaryAxes,                        
                    }}
                />
            </ResizableBox>
        </>
    );
}
