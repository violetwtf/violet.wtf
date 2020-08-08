import React, { useState } from 'react';
import './App.css';
import Creators from './Creators.json';
import Experience from './components/Experience';

// Logos
import GraserLogo from './assets/graser.jpg';
import KiingLogo from './assets/kiing.jpg';
import AntLogo from './assets/ant.jpg';
import WilburLogo from './assets/wilbur.jpg';

function App() 
{
    const [name, setName] = useState("violet mckinney");
    const [link, setLink] = useState("https://violet.wtf");
    const [creators, setCreators] = useState(Creators as any);

    function nl(name: string, link: string)
    {
        setName(name);
        setLink(link);
    }

    const creatorCount = Object.keys(Creators).length;

    let videos = 0;
    let viewsThousands = 0;
    
    for (const key of Object.keys(creators))
    {
        if (key.startsWith("_"))
        {
            continue;
        }

        const creator = creators[key];

        videos += creator.viewsThousands.length;
        viewsThousands += creator.viewsThousands.reduce((a: number, b: number) => a + b);
    }

    const viewsMillions = (viewsThousands / 1000).toFixed(1);


    fetch('https://api.violet.wtf/creators')
        .then((res) =>
        {
            return res.json();
        })
        .then((json) =>
        {
            setCreators(json);
        });

    return (
        <div>
            <div className='nameArea margin50'>
                <p className="name">
                    <p><strong className="actualName"><a href={link}>{name} </a></strong></p>
                    is the developer behind 
                    <strong> {videos}</strong> videos, 
                    by <strong>{creatorCount}</strong> creators, 
                    with <strong>{viewsMillions} million</strong> combined views.
                </p>
                <div className="socials">
                <span 
                        className="social" 
                        onClick={_ => nl("vi@violet.wtf", 'mailto:vi@violet.wtf')}>email
                    </span>
                    <span> | </span>
                    <span 
                        className="social" 
                        onClick={_ => nl("violet#3993", 'https://violet.wtf')}>discord
                    </span>
                    <span> | </span>
                    <span 
                        className="social"
                        onClick={_ => nl("@violet_wtf", 'https://twitter.com/violet_wtf')}>twitter 
                    </span>
                    <span> | </span>
                    <span 
                        className="social"
                        onClick={_ => nl("@violetwtf", 'https://github.com/violetwtf')}>github 
                    </span>
                </div>
            </div>
            <div className='margin50'>
                <Experience 
                    gradientColors={['#aba514', '#a56b01', '#393939']}
                    logo={GraserLogo}
                    creator={creators.graser}
                />
                <Experience
                    gradientColors={['#e49a64', '#a5019a', '#00bbff']}
                    logo={KiingLogo}
                    creator={creators.kiing}
                />
                <Experience
                    gradientColors={['#00bbff', '#01a57e', '#4a9fb0']}
                    logo={AntLogo}
                    creator={creators.ant}
                />
                <Experience
                    gradientColors={['#167bc9', '#4f00a6', '#5f98a1']}
                    logo={WilburLogo}
                    creator={creators.wilbur}
                />
            </div>
            <div className='margin50 footer'>
                made by <a href="humans.txt">humans</a>, powered by <a href="robots.txt">robots</a><br />
                &copy; {new Date().getFullYear()} violet mckinney
            </div>
        </div>
    );

}

export default App;
