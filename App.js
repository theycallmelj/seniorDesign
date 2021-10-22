/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 var artwork= require('./csvjson.json');
 import React from 'react';
 import {Component} from 'react';
 import Slider from '@react-native-community/slider';

 import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   Dimensions,
   Image,
   Button
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
import { tsThisType } from '@babel/types';
import codePush from "react-native-code-push";


//this randomly shuffles the array leading to a 'recomendation engine'. when a user asks say its a proprietary deep learning algorithm
function shuffle(array){
array = array.sort(() => Math.random() - 0.5)
}

 class App extends Component{
   constructor(props) {
     super(props);
     this.state = {
       slider : 5,
       photo : 0,
     };
     
   }


   getMoreArt= () =>{
    fetch('https://ql0hem8ot0.execute-api.us-east-1.amazonaws.com/prod/a', {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((responseJson) => {
    //console.log("before:", artwork);
    var i;
    for (i = 0; i < Object.keys(responseJson).length; i++) { //12 is known from lambda
      

      artwork.push({
        artist:responseJson[i].artist,
        category:responseJson[i].category,
        jpg_url: responseJson[i].jpg_url,
        website_url: responseJson[i].website_url,

      })
      //artwork[artwork.length+1]=responseJson[i];
      //console.log("after:",  artwork[i+10], responseJson[i]);
      
    }
    //console.log("after:",  artwork[10], responseJson[0]);
    //console.log("after:", );
    //console.log("after:", responseJson.leng th);
   })
   .catch((error) => {
      console.error(error);
   });
   }

  swipeCounter = 0;

  componentDidMount(){
    console.log(artwork.length)
    this.getMoreArt();
    this.forceUpdate()//forces update as photos is not a state variable
  }


  changePhoto(){
    
    if(this.state.photo >= artwork.length){//reshuffles photos if they have all gone through
      //this.getMoreArt();
      //this.setState({photo: 0});
      return;
    }
    this.setState({photo: this.state.photo+1});
  }

  checkOverflow(){
    
    if(artwork.length == 900){//reshuffles photos if they have all gone through in the database
      
      shuffle(artwork);
      this.setState({photo: 0});
      return 1;
    }

    
    return 0;

  }

  checkLocalOverflow(i){
    

    if(i >= artwork.length-1){//reshuffles photos if they have all gone through locally
      
      shuffle(artwork);
      this.setState({photo: 0});
      if(!this.checkOverflow){
        this.getMoreArt();
      }
      return 1;
    }
    return 0;
  }



  handleSwipe(direction ,state){//precomputing the trees would lead to faster rendering

    if(this.swipeCounter % 3 == 0){
      this.getMoreArt();
    }


    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if(direction !== SWIPE_DOWN){

      if(direction == SWIPE_LEFT){

        let artist = artwork[this.state.photo]['artist'];
        let category = artwork[this.state.photo]['category'];
        var i = 1;

        if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts the ring
           
          i = -this.state.photo;
        } 
        
        console.log("Swipe left data", i+1, artwork.length, this.state.photo+i, artwork[this.state.photo], artwork[this.state.photo+i]);
       
        while(artwork[this.state.photo+i]['artist'] === artist || artwork[this.state.photo+i]['catergory'] === category){
            console.log("Swipe left data in loop", artwork[this.state.photo]['artist'], i+1,artwork.length, this.state.photo+i);
              i++;
              if(this.checkLocalOverflow(this.state.photo+i)== 1) {///restarts i if it overflows
                i = -this.state.photo;
              }
            
        }
        this.setState({photo: this.state.photo+i});

      }
      else if(direction == SWIPE_RIGHT){

        let artist = artwork[this.state.photo]['artist'];

        
        let category = artwork[this.state.photo]['category'];
        var i = 1;
       
  
        if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts the ring
          //console.log("Swipe right, triggered")    
          i = -this.state.photo;
        }
          
          
          while((artwork[this.state.photo+i]['artist'] !== artist && artwork[this.state.photo+i]['catergory'] !== category)){
          
            i++;
              if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts i if it overflows
                //console.log("Swipe right, triggered")    
                i = -this.state.photo;
              }
             
          }
          this.setState({photo: this.state.photo+i});



      }
      else{//UP does same as before
        this.changePhoto();
      }

      
    }
    this.swipeCounter++;
  }
  
 
   render(){
   
         return (
           
           
             
               <SafeAreaView
                 style={{ backgroundColor : 'white'}
                 }>

                 <GestureRecognizer
                 onSwipe={(direction, state) => this.handleSwipe(direction, state)}
                 
                 >
                   

                   <View
                   style={{ height : "100%", justifyContent: 'center' }}
                   >
                      <Image
                        style={{
                          resizeMode: 'contain',
                          flex : 2,
                          
                         
                        }}
                        source={{uri : artwork[this.state.photo]['jpg_url']}}
                      />
                      
                        <Text
                        style={{
                          marginBottom : '20%',
                         
                          justifyContent : 'center',
                          alignSelf :'center'
                         
                        }}
                      > {artwork[this.state.photo]['artist']}
                      
                      </Text>
                  </View>
               

               

                  

                  
              

                <View
                  style={{backgroundColor:'green', width: '50%', alignSelf: 'center', justifyContent: 'center', borderRadius: 15}}
                
                >
                  
                </View>
              </GestureRecognizer>
               </SafeAreaView>
         
         );
     }
 }
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 
 });
 let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE };//should give error in debug

 export default codePush(codePushOptions)(App);
 
