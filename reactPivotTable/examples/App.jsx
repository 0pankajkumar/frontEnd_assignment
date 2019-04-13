import React from 'react';
import tips from './tips';
import { sortAs } from '../src/Utilities';
import TableRenderers from '../src/TableRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';
import createPlotlyRenderers from '../src/PlotlyRenderers';
import PivotTableUI from '../src/PivotTableUI';
import '../src/pivottable.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

const Plot = createPlotlyComponent(window.Plotly);

class PivotTableUISmartWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { pivotState: props };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ pivotState: nextProps });
    }

    render() {
        return (
            <PivotTableUI
                renderers={Object.assign(
                    {},
                    TableRenderers,
                    createPlotlyRenderers(Plot)
                )}
                {...this.state.pivotState}
                onChange={s => {
                    //   console.log(s);
                    s.vals = s.rows;
                    this.setState({ pivotState: s });
                }}
                unusedOrientationCutoff={Infinity}
            />
        );
    }
}

export default class App extends React.Component {
    componentWillMount() {
        let data = [['Row labels', 'Lang', 'Hours']];
        tips.forEach((item) => {
            data.push([item["Row Labels"], 'English', item['Sum of English']]);
            data.push([item["Row Labels"], 'Math', item['Sum of Maths']]);
            data.push([item["Row Labels"], 'Hindi', item['Sum of Hindi']]);
        });

        this.setState({
            mode: 'demo',
            filename: 'Sample Dataset: Tips',
            pivotState: {
                data: tips,
                rows: ['Row Labels', 'Sum of Maths', 'Sum of English', 'Sum of Hindi'],
                cols: [],
                aggregatorName: 'Custom Sum',
                vals: ['Sum of Maths', 'Sum of English', 'Sum of Hindi'],
                rendererName: 'Table',
                sorters: {

                },
                plotlyOptions: { width: 900, height: 500 },
                plotlyConfig: {},
                showCount: false,
                tableOptions: {
                    clickCallback: function (e, value, filters, pivotData) {
                        var names = [];
                        pivotData.forEachMatchingRecord(filters, function (
                            record
                        ) {
                            names.push(record.Meal);
                        });
                        alert(names.join('\n'));
                    },
                },
            },
        });
    }


    render() {
        return (
            <div>
                <div className="row text-center">

                    <PivotTableUISmartWrapper {...this.state.pivotState} />
                </div>
            </div>
        );
    }
}
