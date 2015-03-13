import React = require("react");

import ProgressBarProps = DRE.ReactProgressBarProps;

interface ProgressBarState {
    started?: number;
    elapsed: number;
    from: number;
    to: number;
    interpolated: number;
}

function easeInOutQuad(t: number) {
	if ((t/=0.5) < 1) return 1/2*t*t;
	return -1/2 * ((--t)*(t-2) - 1);
}

var div = React.DOM.div;

class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {

    state: ProgressBarState = {
        from: 0,
        to: this.props.complete || 0,
        elapsed: 1,
        interpolated: this.props.complete || 0
    };

    componentWillReceiveProps(props: ProgressBarProps) {
        this.setState({
            started: new Date().getTime(),
            elapsed: 0,
            from: this.state.interpolated,
            to: props.complete || 0,
            interpolated: props.complete || 0
        }, () => this.animate());
    }

    animate() {
        var elapsed = (new Date().getTime() - this.state.started) / 300;
        if (elapsed >= 1) {
            this.setState({
                elapsed: 1,
                from: this.state.from,
                to: this.state.to,
                interpolated: this.state.to
            });
        } else {
            var easing = this.props.easing || easeInOutQuad;
            this.setState({
                elapsed,
                from: this.state.from,
                to: this.state.to,
                interpolated: this.state.from +
                    (easing(elapsed) * (this.state.to - this.state.from))
            }, () => requestAnimationFrame(() => this.animate));
        }
    }

    render() {
        return div({ className: "progress" },
            this.state.interpolated < 0.01 ? null : div({
                className: "bar",
                style: {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: (100 * this.state.interpolated) + "%"
                }
            }),
            div({
                className: "caption",
                style: {
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    textAlign: "center"
                }
            }, Math.round(this.state.interpolated * 100) + "%")
        );
    }
}

var testFactory = React.createFactory(ProgressBar);

export = ProgressBar;
