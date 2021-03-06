import React, { useState } from "react";
import "./App.css";
import Creators from "./Creators.json";
import Experience from "./components/Experience";

// Violets
import DefaultViolet from "./assets/violets/0default.png"; // default
import NewYearViolet from "./assets/violets/1newyear.png"; // january
import ValentinesViolet from "./assets/violets/2valentines.png"; // february
import BirthdayViolet from "./assets/violets/3bday.png"; // march 4th
import StPatricksViolet from "./assets/violets/3stpatricks.png"; // rest of march
import PrideViolet from "./assets/violets/6pride.png"; // june
import HalloweenViolet from "./assets/violets/10halloween.png"; // october
import ThanksgivingViolet from "./assets/violets/11thanksgiving.png"; // november
import XmasViolet from "./assets/violets/12xmas.png"; // december

// Logos
import GraserLogo from "./assets/graser.jpg";
import KiingLogo from "./assets/kiing.jpg";
import AntLogo from "./assets/ant.jpg";
import WilburLogo from "./assets/wilbur.jpg";
import TaplLogo from "./assets/tapl.jpg";
import BionicLogo from "./assets/bionic.jpg";
import OctaneLogo from "./assets/octane.png";
import SmpLogo from "./assets/smp.jpg";
import TechnoveLogo from "./assets/technove.jpg";

import ExperienceBox from "./components/ExperienceBox";

const VIOLETS = [
  {
    condition: dateIs(0),
    avatar: NewYearViolet,
    name: "violet mcnewyear",
  },
  {
    condition: dateIs(1),
    avatar: ValentinesViolet,
    name: "violet mccupid",
  },
  {
    condition: dateIs(2, 4),
    avatar: BirthdayViolet,
    name: "violet mcbirthday",
  },
  {
    condition: dateIs(2),
    avatar: StPatricksViolet,
    name: "violet stpatrick",
  },
  {
    condition: dateIs(5),
    avatar: PrideViolet,
    name: "violet mcqueery",
  },
  {
    condition: dateIs(9),
    avatar: HalloweenViolet,
    name: "violet mcspooky",
  },
  {
    condition: dateIs(10),
    avatar: ThanksgivingViolet,
    name: "violet mcthankful",
  },
  {
    condition: dateIs(11),
    avatar: XmasViolet,
    name: "violet claus",
  },
];

// month is 0-indexed, day isn't
function dateIs(month: number, day = -1) {
  const date = new Date();

  if (month !== date.getMonth()) {
    return false;
  }

  if (day > -1 && day !== date.getDate()) {
    return false;
  }

  return true;
}

const DEBUG = false;
const ENDPOINT = !DEBUG ? "https://api.violet.wtf/" : "http://localhost:1235/";

function App() {
  if (DEBUG) {
    (window as any).debugSetViolet = (val: boolean) => {
      setViolet(val);
    };
  }

  let todaysViolet = null;

  for (const violet of VIOLETS) {
    if (violet.condition) {
      todaysViolet = violet;
      break;
    }
  }

  if (!todaysViolet) {
    todaysViolet = {
      name: "violet mckinney",
      avatar: DefaultViolet,
    };
  }

  const [name, setName] = useState(todaysViolet.name);
  const [link, setLink] = useState("https://violet.wtf");
  const [fetched, setFetched] = useState(false);
  const [creators, setCreators] = useState(Creators as any);
  const [isViolet, setViolet] = useState(false);
  const [isForm, setForm] = useState(
    window.location.href.endsWith("violetWasHere")
  );
  const [value, setValue] = useState("");
  const [isShowFormerCreators, setShowFormerCreators] = useState(false);
  // hack
  const [creator, setCreator] = useState(
    Object.keys(creators).filter(
      (id) => creators[id].current && !id.startsWith("_")
    )[0]
  );

  function nl(name: string, link: string) {
    setName(name);
    setLink(link);
  }

  const creatorCount = Object.keys(creators).filter(
    (key) => !key.startsWith("_")
  ).length;

  let videos = 0;
  let viewsThousands = 0;
  let seenVideos: string[] = [];

  for (const key of Object.keys(creators)) {
    if (key.startsWith("_")) {
      continue;
    }

    const creator = creators[key];

    videos += creator.viewsThousands.length;

    for (let i = 0; i < creator.videoIds.length; i++) {
      const id = creator.videoIds[i];

      if (seenVideos.includes(id)) {
        continue;
      }

      seenVideos.push(id);

      if (isNaN(creator.viewsThousands[i])) {
        continue;
      }

      viewsThousands += creator.viewsThousands[i];
    }
  }

  const viewsMillions = (viewsThousands / 1000).toFixed(1);

  if (!fetched) {
    setFetched(true);
    fetch(ENDPOINT + "creators")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setCreators(json);
      });

    const token = localStorage.getItem("t");

    if (token) {
      fetch(ENDPOINT + "check", {
        method: "post",
        body: JSON.stringify(token),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          if (json) {
            setViolet(true);
          }
        });
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (isViolet) {
      const res = await fetch(ENDPOINT + "videos", {
        method: "post",
        body: JSON.stringify({
          id: value
            .replace("https://www.youtube.com/watch?v=", "")
            .replace("https://youtu.be/", ""),
          creator,
          token: localStorage.getItem("t"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (!json) {
        nl("something went terribly wrong", "https://violet.wtf");
      } else {
        nl("done! wooo", "https://graphs.violet.wtf");
      }
    } else {
      const res = await fetch(ENDPOINT + "login", {
        method: "post",
        body: JSON.stringify(value),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();

      if (!json) {
        nl("wrong password lol, for violet only", "https://violet.wtf");
      } else {
        localStorage.setItem("t", json);
        setViolet(true);
      }
    }
  }

  // video count
  const smpVideoCount = creators.smp.videoIds.length;

  const smpTotalViewsThousands =
    smpVideoCount === 0
      ? 0
      : creators.smp.viewsThousands.reduce((a: number, b: number) => a + b);

  let smpViews;

  if (smpTotalViewsThousands >= 1000) {
    smpViews = (smpTotalViewsThousands / 1000).toFixed(1) + " million";
  } else {
    smpViews = smpTotalViewsThousands + " thousand";
  }

  return (
    <div>
      <div className="nameArea margin50">
        <div className="name">
          <div className="violet">
            <a href={link}>
              <img src={todaysViolet.avatar} width="116px" />
            </a>
          </div>
          <div className="innerName">
            <p>
              <strong className="actualName">
                <a href={link}>{name} </a>
              </strong>
            </p>
            <div>
              is the developer behind
              <strong> {videos}</strong> videos, by{" "}
              <strong>{creatorCount}</strong> creators, with{" "}
              <strong>{viewsMillions} million</strong> combined views.
            </div>
          </div>
        </div>
        {!isForm ? (
          <div />
        ) : (
          <div>
            <br />
            <form onSubmitCapture={handleSubmit}>
              <p>
                {isViolet
                  ? "add video"
                  : "hi you found an easter egg, password?"}
              </p>
              <input
                style={{ color: "black" }}
                type={isViolet ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {!isViolet ? (
                <div />
              ) : (
                <div>
                  <select
                    onChange={(e) => setCreator(e.target.value)}
                    style={{ color: "black" }}
                  >
                    {Object.keys(creators)
                      .filter(
                        (id) =>
                          !id.startsWith("_") &&
                          (isShowFormerCreators || creators[id].current)
                      )
                      .map((id) => (
                        <option value={id} key={id}>
                          {creators[id].name + ` (${id})`}
                        </option>
                      ))}
                  </select>
                  <br />
                  <input
                    type="checkbox"
                    onChange={(e) => setShowFormerCreators(e.target.checked)}
                  />
                  <label>show former creators</label>
                </div>
              )}
              <input type="submit" style={{ color: "black" }} />
            </form>
          </div>
        )}
        <div className="socials">
          <span
            className="social"
            onClick={(_) => nl("vi@violet.wtf", "mailto:vi@violet.wtf")}
          >
            email
          </span>
          <span> | </span>
          <span
            className="social"
            onClick={(_) => nl("violet#1337", "https://violet.wtf")}
          >
            discord
          </span>
          <span> | </span>
          <span
            className="social"
            onClick={(_) => nl("@violet_wtf", "https://twitter.com/violet_wtf")}
          >
            twitter
          </span>
          <span> | </span>
          <span
            className="social"
            onClick={(_) => nl("@violetwtf", "https://github.com/violetwtf")}
          >
            github
          </span>
          {!isViolet ? (
            <span />
          ) : (
            <span>
              <span> | </span>
              <span
                className="social"
                onClick={(_) => nl("hi violet", "https://graphs.violet.wtf")}
              >
                graphs
              </span>
              <span> | </span>
              <span className="social" onClick={(_) => setForm(!isForm)}>
                add video
              </span>
            </span>
          )}
        </div>
      </div>
      <div className="margin50">
        <ExperienceBox
          link="https://technove.co"
          creator={{ 
            years: [2021], 
            name: <span className="technove">TECHNOVÉ</span>, 
            current: true,
          }}
          gradientColors={["#222", "#222", "#222"]}
          logo={TechnoveLogo}
        >
          <b>Development company </b> where Violet works. Specialises in optimisation, network{" "}
          splits, server software, and plugins. Violet is now exclusively contracting through{" "}
          TECHNOVÉ.
        </ExperienceBox>
        <ExperienceBox
          link="https://uhcboys.com"
          gradientColors={["#2f2f2f", "#2f2f2f", "#3b3a3a"]}
          creator={creators.smp}
          logo={SmpLogo}
        >
          <b>Minecraft SMP</b> featuring {" "}
          <b><a href="https://uhcboys.com/members/graser">Graser</a></b>,{" "} 
          <b><a href="https://uhcboys.com/members/kiingtong">Kiingtong</a></b>,{" "}
          <b><a href="https://uhcboys.com/members/bionic">Bionic</a></b>,{" "}
          <b><a href="https://uhcboys.com/members/emorsomething">EmOrSomething</a></b>,{" "} 
          <b><a href="https://uhcboys.com/members/grapeapplesauce">Grapeapplesauce</a></b>,{" "}
          <b><a href="https://uhcboys.com/members/xnestorio">xNestorio</a></b>,{" "} 
          <b><a href="https://uhcboys.com/members/zmcnikolai">ZMCNikolai</a></b>,{" "}
          <b><a href="https://uhcboys.com/members/tybzi">TYBZI</a></b>, and {" "}
          <b><a href="https://uhcboys.com/members/vasehh">Vasehh</a></b>.
          Code for <b> {smpVideoCount} videos</b> with
          <b> {smpViews}</b> combined views.
        </ExperienceBox>
        <ExperienceBox
          gradientColors={["#3d3d3d", "#3d3d3d", "#222222"]}
          creator={{ years: [2020, 2021], name: "OctaneMC", current: false }}
          link="https://octanemc.net"
          logo={OctaneLogo}
        >
          A Minecraft network owned by <b>Graser</b> and <b>Kiingtong</b>.
          Violet was the lead developer, managing a team of 4.
          <br />
        </ExperienceBox>
        <Experience
          gradientColors={["#e49a64", "#a5019a", "#00bbff"]}
          logo={KiingLogo}
          creator={creators.kiing}
        />
        <Experience
          gradientColors={["#a6a6a6", "#18a39d", "#948059"]}
          logo={BionicLogo}
          creator={creators.bionic}
        />
        <Experience
          gradientColors={["#aba514", "#a56b01", "#393939"]}
          logo={GraserLogo}
          creator={creators.graser}
        />
        <Experience
          gradientColors={["#c4493d", "#8a5318", "#336f36"]}
          logo={TaplLogo}
          creator={creators.tapl}
        />
        <Experience
          gradientColors={["#00bbff", "#01a57e", "#4a9fb0"]}
          logo={AntLogo}
          creator={creators.ant}
        />
        <Experience
          gradientColors={["#167bc9", "#4f00a6", "#5f98a1"]}
          logo={WilburLogo}
          creator={creators.wilbur}
        />
      </div>
      <div className="margin50 footer">
        made by <a href="humans.txt">humans</a>, powered <span>by </span>
        <a href="https://api.violet.wtf/creators">robots</a>
        <br />
        <span>mediocre source code available </span>
        <span>
          <a href="https://github.com/violetwtf/violet.wtf">here (frontend)</a>{" "}
          and{" "}
        </span>
        <a href="https://github.com/violetwtf/website-backend">here (api)</a>
        <br />
        &copy; {new Date().getFullYear()} violet mckinney
      </div>
    </div>
  );
}

export default App;
