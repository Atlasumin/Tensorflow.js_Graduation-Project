let model;

async function predict_tongue(){
    console.log('a');
    model = undefined;
    console.log("Model loading...");
        modelName = "mobilenet";
        console.log('1')
        model = await tf.loadLayersModel('model/model.json');
        console.log('2')
    console.log("Model is ready!");

    console.log("Try to predict!");
    if(model == undefined){
        alert("模型的导入似乎有点问题，无法使用");
    }
    console.log(model);

    let image = document.getElementById('img');
    let tensor = preprocessImage(image,modelName);

    console.log("tensor is ok");

    let predictions = await model.predict(tensor).data();
    console.log("prodictions:");
    console.log(predictions);
    let results = Array.from(predictions)
        .map(function (p, i) {
            return {
                probability: p,
                className: TONGUE[i]
            };
        }).sort(function (a,b) {
            return b.probability - a.probability;
        }).slice(0,1);
        var tongue_result = {
					"tongue": [{
						"name": "舌头正常",
						"suggest": "身体健康，整挺好"
					}, {
						"name": "舌头泛黄",
						"suggest": "可能上火，请注意休息"
					}, {
						"name": "舌头泛白",
						"suggest": "可能受寒，请注意保暖"
					}, {
						"name": "舌头粘腻",
						"suggest": "身有湿气，请注意祛湿"
					}]
				} ;
    results.forEach(function (p) {
        console.log("识别结果：")
        document.getElementById('shetou-fenxi').style.display='block'
        document.getElementById('tongue_result').innerHTML=p.className
        let len = tongue_result.tongue.length
        for (let i =0;i<len;i++) {
        	if(tongue_result.tongue[i].name == p.className) {
								document.getElementById('tongue_suggest').innerHTML = tongue_result.tongue[i].suggest
document.getElementById('tongue_suggest1').innerHTML = "建议:"

							}
        }
        console.log(p.className + " " + p.probability.toFixed(6));
    })
}

function preprocessImage(image, modelName) {
    //console.log("preprocessImage start！");
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat();

    if (modelName === undefined) {
        return tensor.expandDims();
    } else if (modelName === "mobilenet") {
        let offset = tf.scalar(127.5);
        return tensor.sub(offset)
            .div(offset)
            .expandDims();
    } else {
        alert("Unknown model name..")
    }
}
window.onload = predict_tongue()