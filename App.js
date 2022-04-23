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
 import DeviceInfo from 'react-native-device-info';
 import Analytics from 'appcenter-analytics';
 import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
 import InAppReview from 'react-native-in-app-review';

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
   Button,
   Pressable
 } from 'react-native';
 import { getUniqueId, getManufacturer } from 'react-native-device-info';
 import SplashScreen from 'react-native-splash-screen'
import { tsThisType } from '@babel/types';
import codePush from "react-native-code-push";
import LinearGradient from 'react-native-linear-gradient';
import { Header, Overlay } from 'react-native-elements';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';

import Dots from 'react-native-dots-pagination';
import FastImage from 'react-native-fast-image'
var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

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
       onboarding : 1,
       ten: 0,
       update: 0,
       tap : 0,
     };
     
   }


   updateWeights= async(swipe, catergory) =>{
    
    //

    fetch(`https://xiw630fi66.execute-api.us-east-1.amazonaws.com/prod?swipe=${swipe}&userid=${DeviceInfo.getUniqueId()}&category=${catergory}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((responseJson) => {

   }).catch((error) => {
    console.error(error);
    });
  }


   getMoreArt= () =>{
    
    //

    fetch(`https://ql0hem8ot0.execute-api.us-east-1.amazonaws.com/prod/a?id=${DeviceInfo.getUniqueId()}`, {
      method: 'GET'
   })
   .then((response) => response.json())
   .then((responseJson) => {
    //console.log("before:", responseJson);
    var i;
    for (i = 0; i < Object.keys(responseJson).length; i++) { //12 is known from lambda
      

      artwork.push({
        artist:responseJson[i].artist,
        category:responseJson[i].category,
        jpg_url: responseJson[i].jpg_url,
        website_url: responseJson[i].website_url,

      })


      FastImage.preload([
        {
            uri:responseJson[i].jpg_url,
            priority: FastImage.priority.high
        }]);



      //artwork[artwork.length+1]=responseJson[i];
      //console.log("after:",  artwork[i+10], responseJson[i]);
      
    }
    if(this.state.photo == 10 && this.state.ten == 1 && this.state.update !=1){
      console.log("troll?");
       this.setState({update : 1})
       //this.forceUpdate();
     }
    //console.log("after:",  artwork[10], responseJson[0]);
    //console.log("after:", );
    //console.log("after:", responseJson.leng th);
   })
   .catch((error) => {
      console.error(error);
   });
   
    //this.forceUpdate()
   }
  

  swipeCounter = 0;

  storeData = async (value, key) => {
    console.log("here")
    try {
      await AsyncStorage.setItem(key, value)
      if(key === "@galleriOnboarding"){
        this.setState({onboarding: 0});
      }
      console.log("Is 10 being written", key);
      console.log("here2")
    } catch (e) {
      // saving error
      console.log("Error", e);
    }

  }



  getData = async (key) => {
    const value = await AsyncStorage.getItem(key)
    //console.log("What is read?", value, value !== null);
    if(value !== null && key ==="@galleriOnboarding")  {
        // value previously stored
      this.setState({onboarding: 0})
      return true;
    }
     else if(value !== null)   {
      //console.log("Is 10 being read", key);
       this.setState({ten: 1})
       if(this.swipeCounter < 8){
        //console.log("TENSTEST")
        this.setState({photo: 10});
        this.getMoreArt();
      }
     }
    
   }





   addUser= () =>{

    //this adds the user
    let url = 'https://3i1zkbil0e.execute-api.us-east-1.amazonaws.com/prod?id=' + DeviceInfo.getUniqueId();
    fetch(url, {
      method: 'GET'
   })
   .then((response) => response.json())


  }




  componentDidMount(){
    //console.log(artwork.length)
    SplashScreen.hide();


    //console.log("device", DeviceInfo.getUniqueId())
    this.getData("@galleriOnboarding");
    this.getData("@ten");
    this.addUser();
    this.getMoreArt();
    this.getMoreArt();
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



  handleSwipe(direction, state){//precomputing the trees would lead to faster rendering

    if(this.swipeCounter % 3 == 0){
      this.getMoreArt();
    }
    //console.log("Is 10 being read", this.getData("ten"));
  
    if( (direction == SWIPE_LEFT  || direction == SWIPE_RIGHT ) && (this.swipeCounter < 10 && this.state.ten != 1)){//new code
      this.setState({photo: this.state.photo+1});
      this.swipeCounter++;
      return;
    }
    if(this.swipeCounter == 9){
      this.storeData("done", "@ten");
      this.setState({ten : 1})
    }

    if(this.swipeCounter == 10){
      InAppReview.RequestInAppReview()
     
    }
    
       

    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if(direction !== SWIPE_DOWN){

      if(direction == SWIPE_LEFT && state == 1){
        let deviceId = DeviceInfo.getUniqueId();
        
        this.updateWeights(0, artwork[this.state.photo]['category']);
        let artist = artwork[this.state.photo]['artist'];
        let category = artwork[this.state.photo]['category'];
        var i = 1;
        Analytics.trackEvent('SwipeLeft', {Device : deviceId, id: artwork[this.state.photo]['id'] });
        if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts the ringid
           
          i = -this.state.photo;
        } 
        
        
        while(artwork[this.state.photo+i]['artist'] === artist || artwork[this.state.photo+i]['catergory'] === category){
            console.log("Swipe left data in loop", artwork[this.state.photo]['artist'], i+1,artwork.length, this.state.photo+i);
              i++;
              if(this.checkLocalOverflow(this.state.photo+i)== 1) {///restarts i if it overflows
                i = -this.state.photo+1;
                this.getMoreArt();
              }
            
        }
        this.setState({photo: this.state.photo+i});

      }
      else if(direction == SWIPE_RIGHT && state == 1){
        this.updateWeights(1,artwork[this.state.photo]['category']);
        let deviceId = DeviceInfo.getUniqueId();

        let artist = artwork[this.state.photo]['artist'];

        
        let category = artwork[this.state.photo]['category'];
        Analytics.trackEvent('SwipeRight', {Device : deviceId, id: artwork[this.state.photo]['id'] });
        var i = 1;
       // console.log("Swipe right data 1", i+1, artwork.length, this.state.photo+i, artwork[this.state.photo], artwork[this.state.photo+i]);
       
  
        if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts the ring
          console.log("Swipe right, triggered")    
          i = -this.state.photo;
        }
          
       
          while((artwork[this.state.photo+i]['artist']&& artwork[this.state.photo+i]['catergory'] &&artwork[this.state.photo+i]['artist'] !== artist && artwork[this.state.photo+i]['catergory'] !== category)){
           
  
            i++;
              if(this.checkLocalOverflow(this.state.photo+i)== 1) {//restarts i if it overflows
                console.log("Swipe right, triggered")    
                i = -this.state.photo+1;
                //console.log("AFTER:",i,this.state.photo, artwork[this.state.photo+i]['artist'], artist, artwork[this.state.photo+i]['catergory'], category);
              }
             
          }
          this.setState({photo: this.state.photo+i});



      }
      else{//UP does same as before
        deviceId = DeviceInfo.getUniqueId();
        Analytics.trackEvent('User with scroll up enabled attempted to scroll up', {Device : deviceId});
        //Analytics.trackEvent('User with scroll up disabled attempted to scroll up', {Device : deviceId});
        this.changePhoto();
      }

      
    }
    this.swipeCounter++;
  }
  

  App = () => {
    return(
      <SafeAreaView
      style={{ backgroundColor : 'white'}
      }>

      
      {/**<GestureRecognizer
      onSwipe={(direction, state) => this.handleSwipe(direction, 0)}
      
      >**/}
       
        <LinearGradient colors={['#C4C4C4', '#DDDDDD']}>
        <View
        style={{ height : "100%", justifyContent: 'center', alignItems:'center' }}
        >
          <ScrollView
             horizontal={true}
             directionalLockEnabled={true}
             style={[{height : '100%', minWidth: '100%', alignSelf:'center'}]}

             contentContainerStyle={{maxWidth:750, justifyContent:'center', alignItems:'center', height : '75%'}}
             //onScroll={this._animateScroll.bind(this, index)}
             decelerationRate={'fast'}
             //snapToInterval={375}
            // snapToInterval={375} //your element width
            disableIntervalMomentum={true}
            snapToAlignment={"center"}
             scrollEventThrottle={16}
             contentOffset={{x:187.5,y:0}}//just needs to be the width of one
             ref={(scroller) => {this.scroller = scroller}}
             onScroll={event => { 
                //console.log("They see me scrolling", this.xOffset, event.nativeEvent.contentOffset.x);
               const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
              
               this.xOffset = event.nativeEvent.contentOffset.x
             
               if(this.xOffset >= 567.5){
                this.scroller.scrollEnabled
                   //this.handleSwipe(SWIPE_RIGHT, 1)
                   //this.scroller.scrollTo({ x: 375, y: 0, animated: false })
               }
               if(this.xOffset <= 286.95){
                 //this.handleSwipe(SWIPE_LEFT, 1)
                 //this.scroller.scrollTo({ x: 375, y: 0, animated: false })
               }
              
              
             }}

             onMomentumScrollEnd={event => { 
              //console.log("They see me scrolling", this.xOffset, event.nativeEvent.contentOffset.x);
             const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
            
             this.xOffset = event.nativeEvent.contentOffset.x
             //console.log("XOman", event.nativeEvent)
           
            
           }}


             onScrollEndDrag={event => { 
               const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
              
               this.xOffset = event.nativeEvent.contentOffset.x

               console.log("XO", event.nativeEvent)
               
               if(this.xOffset >= 200){
                   this.handleSwipe(SWIPE_RIGHT)
                   this.scroller.scrollTo({ x: 187.5, y: 0, animated: true })
               }
               if(this.xOffset <= 150){
                 this.handleSwipe(SWIPE_LEFT)
                 this.scroller.scrollTo({ x: 187.5, y: 0, animated: true })
               }

              
             }}



          >
            <Image
             style={{
               resizeMode: 'contain',
               height: 415,
               width: 375,
               marginTop : 50,
              
             }}
             source={require("./assets/pics/Like.png")}
           />
       

          <Pressable style={{height: 415,
               width: 375, justifyContent:'center', alignSelf: 'center'}}
               
               onPress={()=>{this.setState({tap :1})}}>
          
          {this.state.photo <10 || this.state.photo > 10 || (this.state.photo == 10 && this.state.ten == 1 && this.state.update==1)?
           <Image
             style={{
               resizeMode: 'contain',
               height: 415,
               width: 375,
               
               marginTop : 50,
              
             }}
             onPress={()=>{this.setState({tap :1})}}
             resizeMode={FastImage.resizeMode.contain}
             source={{ uri : artwork[this.state.photo]['jpg_url']}}
           />
            :null}
           </Pressable>
            
            <Overlay visible={this.state.tap == 1} onBackdropPress={()=>{this.setState({tap :0})}}
            
            overlayStyle={{backgroundColor: 'black', borderRadius:30}}
            >
              <View style={{height: 395,
               width: 325,
               backgroundColor:'black'
              }}
               >
                {artwork[this.state.photo]?
                <View>
                  <Text
                    style={{
                      //marginBottom : '20%',
                      
                      //justifyContent : 'center',
                      //alignSelf :'center'
                      color:'white',
                      fontSize:24,
                      fontWeight: "600",
                      marginTop:50
                    }}
                  > {artwork[this.state.photo]['artist'].replace(/-/g,' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
                  
                  </Text>

                  <Text
                    style={{
                      //marginBottom : '20%',
                      
                      //justifyContent : 'center',
                      //alignSelf :'center'
                      color:'white',
                      fontSize:24,
                      fontWeight: "800",
                      marginTop:50
                    }}
                  > {artwork[this.state.photo]['website_url'].replace("https://artsy.net/artwork/", "").replace(/-/g,' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()).replace(artwork[this.state.photo]['artist'].replace(/-/g,' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), "")}


                  </Text>


                </View>
                  :
                  null}
              </View>
              
            </Overlay>

           <View style={{height: 415,
               width: 375,
              }}
               >
           <Image
             style={{
               resizeMode: 'contain',
               height: 415,
               width: 375,
               
               marginTop : 50,
              
             }}
             source={require("./assets/pics/Dislike.png")}
           />
          </View>
           
           
           </ScrollView>

          

       </View>
       </LinearGradient>
    

    

       

       
   

     <View
       style={{backgroundColor:'green', width: '50%', alignSelf: 'center', justifyContent: 'center', borderRadius: 15}}
     
     >
       
     </View>
  {
    //</GestureRecognizer>
  }   
 
   
    </SafeAreaView>


    );
  }


  
  




  onboardSwipeRight(){
    console.log('render2', this.state.onboarding);
    if(this.state.onboarding < 3){
      this.setState({onboarding:this.state.onboarding+1})
    }
    else{
      this.storeData("done" ,"@galleriOnboarding");
    }
  }
  onboardSwipeLeft(){
    console.log('render', this.state.onboarding-1);
    if(this.state.onboarding > 1){
      this.setState({onboarding:this.state.onboarding-1})
    }
  }



  

  Onboarding = () =>{

 return(






  <LinearGradient colors={['#C4C4C4', '#DDDDDD']}>
  <GestureRecognizer
      onSwipeRight={()=>this.onboardSwipeRight()}
      onSwipeLeft={()=> this.onboardSwipeLeft()}
      
      >
    {this.state.onboarding === 1 ?
    <View
    style={{ height : "100%", justifyContent: 'center',}}
    >
       
       
       
        <View style={{alignItems: 'center',  marginTop: -100 }}>
        <Text style={{fontSize : 20, fontFamily:'EBGaramondRoman',}}>Welcome to</Text>
        <Text style={{fontWeight: '800', fontSize : 50,fontFamily:'EBGaramondRoman'}}>Galleri</Text>
        </View>


        <View style={{top: 200}}>
        <Dots length={3} active={this.state.onboarding-1} activeColor='black' passiveColor='#505050' />
        </View>
       
    </View>
    :null
  }

{this.state.onboarding === 2 ?
    <View
    style={{ height : "100%", justifyContent: 'center'}}
    >
       
       
       <Image
             style={{
               resizeMode: 'contain',
               height: 415,
               width: 375,
               marginTop : -100,
              
             }}
             source={require("./assets/pics/1.png")}
           />
        <Dots length={3} active={this.state.onboarding-1} activeColor='black' passiveColor='#505050' />
        
       
    </View>
    :null
  }

{this.state.onboarding === 3?
    <View
    style={{ height : "100%", justifyContent: 'center',}}
    >
       
       
       
       <Image
             style={{
               resizeMode: 'contain',
               height: 415,
               width: 375,
               marginTop : -100,
              
             }}
             source={require("./assets/pics/2.png")}
           />
        <Dots length={3} active={this.state.onboarding-1} activeColor='black' passiveColor='#505050' />
        
       
    </View>
    :null
  }






</GestureRecognizer>
  </LinearGradient>

  
 )
 ;
  }







   render(){
   
         return (
          <View>
           <Header
  
            centerComponent={{ text: 'Galleri', style: { color: '#fff', fontSize :20, fontFamily:'EBGaramondRoman', fontWeight: '400', letterSpacing : 1.5 } }}
            backgroundColor="black"
          />

           
             {this.state.onboarding > 0 ? this.Onboarding() : this.App()}
            
         </View>
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
 
