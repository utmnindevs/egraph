import React from 'react';

const SvgTab = ({ svgContent }) => {
    return (
        <div className="image-workspace" style={{ height: '500px', width: '800px' }}>
            <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>
    );
};

export default SvgTab;
