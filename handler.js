const main = (db) => {
  const data = db.base;
  const register = db.training;

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
      throw alert("The EVs can not be negative or greater than 252");

    for (let i in result) {
      if (number !== 0) {
        const webinarNumber = Math.trunc(number / data[i].evs);
        number -= data[i].evs * webinarNumber;
        result[i] =
          webinarNumber > 0
            ? {
                ok: true,
                webinarNumber,
                name: data[i].name,
                time: data[i].time,
              }
            : { ok: false };
      }
    }

    if (number !== 0) throw alert("Something went wrong in the calculation");
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

  document.getElementById("calculate").addEventListener("click", () => {
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
    const name = document.getElementById("name").value;

    if (
      inputs.atk.value +
        inputs.def.value +
        inputs.spd.value +
        inputs.atkSp.value +
        inputs.defSp.value +
        inputs.hp.value >
      508
    )
      throw alert("The sum of the EVs can not be greater than 508");

    if (name.length === 0) {
      throw alert("The name can not be null");
    }

    const result = inputEVs(inputs);

    saveData(name, result);
    showResult(result, inputs);
  });

  document.getElementById("update").addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("select").value;

    let pokemon = null;
    if (name.length === 0) {
      throw alert("The name can not be null");
    }

    for (const i in register) {
      if (i === name) {
        pokemon = register[i];
      }
    }
    for (const i in pokemon) {
      pokemon[i];
    }
    showUpdate(pokemon.training, name);
    document.getElementById("result").innerHTML;
  });
};

const showUpdate = (result, name) => {
  let text = "";
  for (let i in result) {
    const webinarDate = shwoTraining(result[i], i, name);
    text += `<p><b>${i}:</b></p> ${webinarDate.text} tiempo: ${webinarDate.time.days} dias y ${webinarDate.time.hours} ahoras`;
  }

  document.getElementById("result").innerHTML = text;
};

const shwoTraining = (json, stat, name) => {
  console.log(json);
  let text = "";
  let time = 0;
  for (let i in json) {
    text += `${
      json[i].ok
        ? `${json[i].name}: ${json[i].webinarNumber} <button onClick="updateWebinar('${name}','${stat}','${i}','${json[i].webinarNumber}')" >Done</button>, `
        : ""
    }`;
    time += json[i].ok ? json[i].webinarNumber * json[i].time : 0;
  }
  return { text, time: calculateTime(time), totalTime: time };
};

const updateWebinar = (name, stat, webinar, number) => {
  database.ref(`training/${name}`).on(
    "value",
    function (snapshot) {
      const pokemon = snapshot.val();

      if (number > 1) {
        pokemon.training[stat][webinar].webinarNumber = number - 1;
        alert(
          `Recuerda aun queda ${parseInt(number - 1)} seminarios de ${webinar}`
        );
      } else {
        pokemon.training[stat][webinar] = { ok: false };
      }
      saveData(name, pokemon.training);
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
};

const showResult = (result, inputs) => {
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

const saveData = (name, training) => {
  database.ref(`training/${name}`).set({
    training,
  });
};

const init = async () => {
  await database.ref().on(
    "value",
    function (snapshot) {
      const pokemons = snapshot.val().training;
      for (const name in pokemons) {
        $("#select").append(`<option value="${name}">${name}</option>`);
      }
      main(snapshot.val());
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
  );
};

init();
