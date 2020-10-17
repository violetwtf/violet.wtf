import React from "react";

export default function ExperienceBox(props: any) {
  const { creator } = props;

  const background = {
    background:
      `linear-gradient(156deg, ` +
      `${props.gradientColors[0]} 0%, ` +
      `${props.gradientColors[1]} 25%, ` +
      `${props.gradientColors[2]} 100%)`,
  };

  const currentYear = creator.current
    ? "Present"
    : creator.years.length > 1
    ? creator.years[1]
    : false;

  return (
    <div>
      <div className="experience" style={background}>
        <a href={props.link}>
          <img className="logo" src={props.logo} />
        </a>
        <div className="expText">
          <p>
            <b className="expName">
              <a className="expLink" href={props.link}>
                {creator.name}
              </a>
            </b>
          </p>
          <p>{props.children}</p>
          <span className="expYear">
            {creator.years[0]} {currentYear ? ` - ` + currentYear : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
