import React from 'react';

const OriginalResearch2Main = ({heading,body,date}) => {
    return (
        <div>
            <div className="swift-folios-research-row2">
              <div className="swift-folios-research-row2-header">
                {heading}
              </div>
              <div className="swift-folios-research-row2-text" dangerouslySetInnerHTML={{ __html: body }}></div>
              <div className="swift-folios-research-row2-date">{date}</div>
            </div>
        </div>
    );
};

export default OriginalResearch2Main;