import React from 'react';

const Code = props => (
    <pre
        style={{
            position: 'absolute',
            top: 12,
            right: 12,
            bottom: 12,
            width: 500,
            border: '1px solid #eee',
            borderRadius: 4,
            overflowX: 'scroll',
            fontSize: 11,
            lineHeight: 1.4,
            boxSizing: 'border-box',
            padding: 12,
            margin: 0,
        }}
        {...props}
    />
);

export default Code;