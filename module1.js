exports.getDate = function(){
    let date=new Date();
        //let day=date.getDay();
        // let days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        // let dayType=days[day];
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    let dayType=date.toLocaleDateString("en-US",options);
    return dayType;
}

module.exports.getDay=function (){
    let date=new Date();
        //let day=date.getDay();
        // let days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        // let dayType=days[day];
    let options={
        weekday:"long",
    };
    let dayType=date.toLocaleDateString("en-US",options);
    return dayType;
};


