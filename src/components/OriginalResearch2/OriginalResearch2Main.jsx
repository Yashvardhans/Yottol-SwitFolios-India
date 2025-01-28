import React from 'react';

const OriginalResearch2Main = ({heading,body,thumbNail}) => {
    return (
        <div>
            <div className="swift-folios-research-row2">
              <div className="swift-folios-research-row2-header">
                {heading}
              </div>
              <div className="swift-folios-research-row2-text" dangerouslySetInnerHTML={{ __html: body }}></div>
              <div className="swift-folios-research-row2-date"></div>
            </div>
        </div>
    );
};

export default OriginalResearch2Main;