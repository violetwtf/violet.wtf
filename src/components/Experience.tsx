import React, { useState } from 'react';

export default function Experience(props: any)
{

    const { creator } = props;

    const background = 
    {
        background: `linear-gradient(156deg, ` + 
        `${props.gradientColors[0]} 0%, ` + 
        `${props.gradientColors[1]} 25%, ` + 
        `${props.gradientColors[2]} 100%)`
    }

    const currentYear = creator.current 
        ? 'Present' 
        : (
            creator.years.length > 1
            ? creator.years[1]
            : false
        );

    const totalViewsThousands = creator.viewsThousands.reduce((a: number, b: number) => a + b);

    let views: string;

    if (totalViewsThousands >= 1000)
    {
        views = totalViewsThousands / 1000 + " million";
    }
    else
    {
        views = totalViewsThousands + " thousand";
    }

    const isOneVideo = creator.viewsThousands.length === 1;

    return (
        <div className='experience' style={background}>
            <img className='logo' src={props.logo} />
            <div className='expText'>
                <p>
                    <b className='expName'>
                        <a className='expLink' href={'https://youtube.com/' + creator.yt}>
                            { creator.name }
                        </a>
                    </b>
                </p>
                <p>
                    <b>{creator.subs} </b> 
                    subscribers &middot; collaborated on 
                    <b> {creator.viewsThousands.length}</b> video{isOneVideo ? '' : 's'}
                    {creator.current ? ', and counting, ' : ' '}
                    with <b>{views}</b>{isOneVideo ? '' : ' total'} views.
                    </p>
                <span className='expYear'>
                    {creator.years[0]} {currentYear ? ` - ` + currentYear : ''}
                </span>
            </div>
        </div>
    );

}