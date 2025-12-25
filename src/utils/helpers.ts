export const updateState = (component: React.Component<any, any>, stateKey: string, stateValue: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!component) {
            console.error("Component was null or undefined in helpers#updateState");
            return reject(new Error('Component was null or undefined'));
        }
        if (typeof component.setState !== 'function') {
            console.error("Component argument had no setState in helpers#updateState");
            return reject(new Error('Component has no setState'));
        }

        // Use functional setState pattern and resolve when the update is applied.
        component.setState((prevState: any) => ({
            ...prevState,
            [stateKey]: stateValue,
        }), () => {
            // console.log(`After updating state on component, new state is: ${JSON.stringify(component.state)}`);
            resolve();
        });
    });
};

export const multiUpdateState = (component: React.Component<any, any>, stateKVPs: { [key: string]: any }): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!component) {
            console.error("Component was null or undefined in helpers#updateState");
            return reject(new Error('Component was null or undefined'));
        }
        if (typeof component.setState !== 'function') {
            console.error("Component argument had no setState in helpers#updateState");
            return reject(new Error('Component has no setState'));
        }

        // Use functional setState pattern and resolve when the update is applied.
        component.setState((prevState: any) => ({
            ...prevState,
            ...stateKVPs,
        }), () => {
            // console.log(`After updating state on component, new state is: ${JSON.stringify(component.state)}`);
            resolve();
        });
    });
}