const fs=require("fs");
const express=require("express");
const axios = require('axios');

const app=express();

let lookupData=[];
let iteration=1;

 fs.readFile('file.txt',"utf8",(err,data)=>{
    let words=[];
    let wordsCount={};
    let arr=[]
    data= data.replace(/[^a-zA-Z ]/g,'')
    words = data.toLowerCase().split(' ')
    words.map((word)=>{
        if(word !==''){
        if(!wordsCount[word]){     
            wordsCount[word]=1
        }
        else{
            wordsCount[word]=wordsCount[word]+1
        }
    }
    });

    arr=Object.keys(wordsCount).map((key)=>{
        return {
        'key':key,
        'val':wordsCount[key]
        }
        });

    let sortedWords=arr.sort((a,b)=>{
        return b.val-a.val
        })
    
    let finalWords=sortedWords.slice(0, 10)
    finalWords.map((obj)=>{
        perforemGetReq(obj)
    })
 } )

 successCallback=(data,obj)=>{
     lookupData.push({word:obj.key,count:obj.val,data:data['def']})
     ++iteration

     if(iteration===10){
         formatData(lookupData)
     }
 }

 formatData=(data)=>{
    
    let formatedData= data.map((obj1)=>{
        let formatedObj={
            word:obj1.word,
            count:obj1.count,
            pos:'',
            synonyms:[]
        }
         obj1.data.map((obj2)=>{
            formatedObj['pos']=obj2['pos']
            obj2.tr.map((obj3)=>{
                if(obj3['syn'])
                obj3['syn'].map((obj4)=>{formatedObj['synonyms'].push(obj4.text)})
            })
            })
            

        return formatedObj
        })

    formatedData=formatedData.sort((a,b)=>{
        return b.count-a.count
        })
        console.log("Dataa",formatedData)
 }
 perforemGetReq=(word)=>{
    let text=word.key
    let config={
        method:"get",
        url:'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
        params:{
            'key':'dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf',
            'lang':'en-en',
            'text':text
        }
    }
    axios(config)
        .then((data)=>{
            successCallback(data.data,word)
        })
        .catch((error)=>{
            console.log("Errorrrr",error)
        })
 }

const port =process.env.PORT || 5000;
app.listen(port,()=>console.log(`server started on port ${port}`));