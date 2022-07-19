import './App.css';
import {useState} from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Button,
  ButtonGroup,
  Stack, HStack, VStack, Box
} from '@chakra-ui/react'
import { Body, Container, Header } from "./components/index.js";
import { connect } from "get-starknet"

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [bal, setBal] = useState(0)

  async function startSession() {
    console.log("start")
    try {
      const wallet = await connect({
        include: ["braavos"],
      });
      if (wallet) {
          await wallet.enable({ showModal: true });
          setIsConnected(!!wallet?.isConnected);
      }
      console.log("isConnected: ", isConnected)
    } catch {}
  }

  async function bet() {
    console.log("bet")
    setBal(bal+1)
    // readTokenBalance().then(balance => setBal(balance ?? "Error"))
    // ... 
  }

  return (
    
    <Container>
      <Header>
        <Button
          
          loadingText='Connecting'
          colorScheme='blue'
          variant='outline'
          onClick={startSession}
        >
          Connect
        </Button>
      </Header>
      <Body>
        <h1>
          Balance: {bal} ETH
        </h1>
        
        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30} onChangeEnd={(val) => console.log(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <Stack direction='row' spacing={4}>

        <Button
          loadingText='Connecting'
          colorScheme='blue'
          variant='outline'
          onClick={bet}
        >
        Bet
        </Button>
      </Stack>
      </Body>
    </Container>
  );
}

export default App;
