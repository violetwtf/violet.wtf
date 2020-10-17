import React, { useState } from "react";
import "./App.css";
import Creators from "./Creators.json";
import Experience from "./components/Experience";

// Logos
import GraserLogo from "./assets/graser.jpg";
import KiingLogo from "./assets/kiing.jpg";
import AntLogo from "./assets/ant.jpg";
import WilburLogo from "./assets/wilbur.jpg";
import TaplLogo from "./assets/tapl.jpg";

const DEBUG = false;
const ENDPOINT = !DEBUG ? "https://api.violet.wtf/" : "http://localhost:1235/";

function App() {
  if (DEBUG) {
    (window as any).debugSetViolet = (val: boolean) => {
      setViolet(val);
    };
  }

  const [name, setName] = useState("violet mckinney");
  const [link, setLink] = useState("https://violet.wtf");
  const [fetched, setFetched] = useState(false);
  const [creators, setCreators] = useState(Creators as any);
  const [isViolet, setViolet] = useState(true);
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
      console.log(creator);
      return;

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

  return (
    <div>
      <div className="nameArea margin50">
        <p className="name">
          <p>
            <strong className="actualName">
              <a href={link}>{name} </a>
            </strong>
          </p>
          is the developer behind
          <strong> {videos}</strong> videos, by <strong>{creatorCount}</strong>{" "}
          creators, with <strong>{viewsMillions} million</strong> combined
          views.
        </p>
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
            onClick={(_) => nl("violet#3993", "https://violet.wtf")}
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
        <Experience
          gradientColors={["#e49a64", "#a5019a", "#00bbff"]}
          logo={KiingLogo}
          creator={creators.kiing}
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
