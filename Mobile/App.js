import { thisExpression, throwStatement } from '@babel/types';
 import React, { Component } from 'react';
 import {
   StyleSheet,
   View,
   Text,
   ToastAndroid,
   Dimensions,
   TouchableHighlight,
   Alert
 } from 'react-native';
 
  class App extends Component {
    constructor() {
      super();
      this.state = {
        readings: [],
        BPM: 0,
        SpO2: 0,
        hazard: [false,false]
      }
    }
 
   async componentDidMount() {
     fetch(`http://10.30.9.65:5000/request`, {
       method: 'GET',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       }
     }).then(res => res.json())
     .then((json) => {
       this.setState({
          readings: [...this.state.readings,json],
          BPM : json.BPM,
          SpO2: json.SpO2
       });
       if (json.SpO2 <= 95 && json.SpO2 != 0 && json.BPM != 0)
       {
         Alert.alert(
           "Warning",
           "Possible health risk detected!",
           [
             {
               text: "OK"
             },
           ],
           {
             cancelable: false
           });
       } 
     }).catch((err) => {ToastAndroid.show(""+err,ToastAndroid.SHORT)});
     setTimeout(() => { 
     try {
     setInterval(async () => {
       fetch(`http://10.30.9.65:5000/request`, {
       method: 'GET',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       }
     }).then(res => res.json())
     .then((json) => {
      this.setState({
        readings: [...this.state.readings,json],
        BPM : json.BPM,
        SpO2: json.SpO2
     });
     if (json.SpO2 <= 95 && json.SpO2 != 0 && json.BPM != 0)
     {
       Alert.alert(
         "Warning",
         "Possible health risk detected!",
         [
           {
             text: "OK"
           },
         ],
         {
           cancelable: false
         });
     }    
     }).catch((err) => {console.log(err);ToastAndroid.show(""+err,ToastAndroid.SHORT)});
   }, 3000);
 } catch(err) {console.log(err);ToastAndroid.show(""+err,ToastAndroid.SHORT)}
     },3000);
   }

   colorSwap(param)
   {
    if (param.type == "BPM")
    {
      if (param.value >= 60 && param.value <= 72)
      {
        return "yellow";
      }
      else if (param.value > 72 && param.value <= 90)
      {
        return "green";
      }
      else if (param.value > 90 && param.value <= 122)
      {
        return "red";
      }
    }
    else if (param.type == "SpO2")
    {
      if (param.value >= 94)
      {
        return "green";
      }
      else if (param.value >= 80 && param.value < 94)
      {
        return "red";
      }
    }
   }
 
   render()
    {
     return (
       <View style={styles.center}>
          <View style={{ flex: 1,justifyContent: "center" }}><Text style={{ fontSize: 36,fontFamily: "serif" }}>Health tracker</Text></View>
          <View style={{ flex: 1,justifyContent: "center",alignItems: "center",elevation: 1,borderTopWidth: 2,borderBottomWidth: 2,width: "100%" }}>
            <Text style={{ fontSize: 26,textAlign: "center" }}>BPM</Text>
            <View><Text style={{ fontSize: 100,color: this.colorSwap({value: this.state.BPM,type: "BPM"}) }}>{this.state.BPM}</Text></View>
          </View>
          <View style={{ flex: 1,justifyContent: "center",alignItems: "center",elevation: 1,borderBottomWidth: 2,width: "100%" }}>
            <Text style={{ fontSize: 26,textAlign: "center" }}>SpO2</Text>
            <View><Text style={{ fontSize: 100,color: this.colorSwap({value: this.state.SpO2,type: "SpO2"}) }}>{this.state.SpO2}</Text></View>
          </View>
       </View>
     );
    } 
 }
 
 const styles = StyleSheet.create({
   center: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   },
   text: {
     textAlign: "center",
     marginTop: "40%",
     color: "#00FFFF",
     fontSize: 16
   }
 });
 
 export default App;
 