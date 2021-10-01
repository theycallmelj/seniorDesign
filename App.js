/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 const artwork= require('./csvjson.json');
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



var photos = ["https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2020/04/23035908/PS14.078_01_G02-Large-TIFF_4000-pixels-long-208x300.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2021/07/09145915/50.6075_01_b02-Large-TIFF_4000-pixels-long-300x232.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25041531/95.413_01_b02-Large-TIFF_4000-pixels-long-300x232.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25224625/PH09.017PG_01_b02-Large-TIFF_4000-pixels-long-300x241.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25045823/96.606_01_FTD02-Large-TIFF_4000-pixels-long-239x300.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/03012304/CFA_ModCont_heroimage-300x177.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2021/08/19113110/x2019.7022_22_H02-Large-TIFF_4000-pixels-long-300x193.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25015142/92.59-Large-TIFF_4000-pixels-long-300x231.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25082201/ST1998.0243_01_H02-Large-TIFF_4000-pixels-long-300x212.jpg", "https://sfmoma-media-dev.s3.us-west-1.amazonaws.com/www-media/2018/08/25220733/2009.33_01_b02-Large-TIFF_4000-pixels-long-300x199.jpg" ]


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
  componentDidMount(){
    console.log(artwork[0])
    shuffle(artwork);
    this.forceUpdate()//forces update as photos is not a state variable
  }


  changePhoto(){
    
    if(this.state.photo >= artwork.length){//reshuffles photos if they have all gone through
      shuffle(artwork);
      this.setState({photo: 0});
      return;
    }
    this.setState({photo: this.state.photo+1});
  }

  checkOverflow(){
    if(this.state.photo >= artwork.length){//reshuffles photos if they have all gone through
      shuffle(artwork);
      this.setState({photo: 0});
      return 1;
    }
    return 0;
  }

  handleSwipe(direction ,state){//precomputing the trees would lead to faster rendering
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    if(direction !== SWIPE_DOWN){

      if(direction == SWIPE_LEFT){

      let artist = artwork[this.state.photo]['artist'];
      let category = artwork[this.state.photo]['category'];
      var i = 1;
       this.checkOverflow();


        
        
        while(artwork[this.state.photo+i]['artist'] === artist || artwork[this.state.photo+i]['catergory'] === category){
            i++;
            if(this.checkOverflow() == 1) {//restarts i if it overflows
                i = 0;
            }
           
        }
        this.setState({photo: this.state.photo+i});

      }
      else if(direction == SWIPE_RIGHT){

        let artist = artwork[this.state.photo]['artist'];
        let category = artwork[this.state.photo]['category'];
        var i = 1;
         this.checkOverflow();
  
  
          
          
          while((artwork[this.state.photo+i]['artist'] !== artist && artwork[this.state.photo+i]['catergory'] !== category)){
              i++;
              if(this.checkOverflow() == 1) {//restarts i if it overflows
                  i = 0;
              }
             
          }
          this.setState({photo: this.state.photo+i});



      }
      else{//UP does same as before
        this.changePhoto();
      }

      
    }
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
 
