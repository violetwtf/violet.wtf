import React from 'react';
import ExperienceBox from './ExperienceBox';

export default function Experience(props: any)
{

    const { creator } = props;

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

    const yt = 'https://youtube.com/' + creator.yt;

    return (
        <ExperienceBox 
            creator={creator} 
            link={yt} 
            gradientColors={props.gradientColors} 
            logo={props.logo}
        >
            <b>{creator.subs} </b> 
            subscribers &middot; collaborated on 
            <b> {creator.viewsThousands.length}</b> video{isOneVideo ? '' : 's'}
            {creator.current ? ', and counting, ' : ' '}
            with <b>{views}</b>{isOneVideo ? '' : ' total'} views.
        </ExperienceBox>
    );

}