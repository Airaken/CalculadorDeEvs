const data = {
  POQUISIMO_TIEMPO: { name: "Poquisimo tiempo", time: 1, evs: 4 },
  MUY_POCO_TIEMPO: { name: "Muy poco tiempo", time: 2, evs: 8 },
  POCO_TIEMPO: { name: "Poco timepo", time: 3, evs: 12 },
  UN_TIEMPO: { name: "Un tiempo", time: 4, evs: 16 },
  BASTANTE_TIEMPO: { name: "Bastante tiempo", time: 8, evs: 32 },
  MUCHO_TIEMPO: { name: "Mucho tiempo", time: 12, evs: 48 },
  MUCHISIMO_TIEMPO: { name: "Muchisimo tiempo", time: 24, evs: 96 },
};

const calculate = (number) => {
  const result = {
    MUCHISIMO_TIEMPO: { ok: false },
    MUCHO_TIEMPO: { ok: false },
    BASTANTE_TIEMPO: { ok: false },
    UN_TIEMPO: { ok: false },
    POCO_TIEMPO: { ok: false },
    MUY_POCO_TIEMPO: { ok: false },
    POQUISIMO_TIEMPO: { ok: false },
  };
  if (number < 0 || number > 252)
    throw new Error("The EVs can not be negative or greater than 252");

  for (let i in result) {
    if (number !== 0) {
      const webinarNumber = Math.trunc(number / data[i].evs);
      number -= data[i].evs * webinarNumber;
      result[i] =
        webinarNumber > 0
          ? { ok: true, webinarNumber, name: data[i].name, time: data[i].time }
          : { ok: false };
    }
  }

  if (number !== 0) throw new Error("Something went wrong in the calculation");
  return result;
};

const inputEVs = (arg) => {
  const result = {};

  for (let i in arg) {
    if (arg[i].value) {
      result[i] = calculate(arg[i].value);
    }
  }
  return result;
};

const calculateTime = (time) => {
  const days = Math.trunc(time / 24);
  const hours = time - days * 24;
  return { days, hours };
};

const shwoWebinars = (json) => {
  let text = "";
  let time = 0;
  for (let i in json) {
    text += `${
      json[i].ok ? `${json[i].name}: ${json[i].webinarNumber}, ` : ""
    }`;
    time += json[i].ok ? json[i].webinarNumber * json[i].time : 0;
  }
  return { text, time: calculateTime(time), totalTime: time };
};

const inputs = () => {
  const inputs = {
    atk: {
      name: "Ataque",
      value: parseInt(document.getElementById("atk").value.toString()),
    },
    def: {
      name: "Defensa",
      value: parseInt(document.getElementById("def").value.toString()),
    },
    spd: {
      name: "Valocidad",
      value: parseInt(document.getElementById("spd").value.toString()),
    },
    atkSp: {
      name: "Ataque Especial",
      value: parseInt(document.getElementById("atkSp").value.toString()),
    },
    defSp: {
      name: "Defensa Especial",
      value: parseInt(document.getElementById("defSp").value.toString()),
    },
    hp: {
      name: "HP",
      value: parseInt(document.getElementById("hp").value.toString()),
    },
  };

  if (
    inputs.atk.value +
      inputs.def.value +
      inputs.spd.value +
      inputs.atkSp.value +
      inputs.defSp.value +
      inputs.hp.value >
    508
  )
    throw new Error("The sum of the EVs can not be greater than 508");

  const result = inputEVs(inputs);
  let text = "";
  let totalTime = 0;
  for (let i in result) {
    const webinarDate = shwoWebinars(result[i]);
    text += `<p><b>${inputs[i].name}:</b></p> ${webinarDate.text} tiempo: ${webinarDate.time.days} dias y ${webinarDate.time.hours} ahoras`;
    totalTime += webinarDate.totalTime;
  }
  totalTime = calculateTime(totalTime);
  text += `<p><b>Tiempo total</b> : ${totalTime.days} dias y ${totalTime.hours} horas </p>`;
  document.getElementById("result").innerHTML = text;
};
