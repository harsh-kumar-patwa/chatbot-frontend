import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { Slide, Grow } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/chat', { message: input });
      setMessages([...newMessages, { text: response.data.message, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Grow in>
          <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', p: 2, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Bot9 Reserve
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, p: 1, borderRadius: 1, backgroundColor: '#2c2c2c' }}>
              {messages.map((message, index) => (
                <Slide direction="up" in key={index}>
                  <Box sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 1.5, 
                        backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                        color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                        maxWidth: '70%',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body1">{message.text}</Typography>
                    </Paper>
                  </Box>
                </Slide>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                sx={{ mr: 1, backgroundColor: 'background.paper', borderRadius: 1 }}
              />
              <Button variant="contained" endIcon={<SendIcon />} onClick={sendMessage} sx={{ p: 1.5 }}>
                Send
              </Button>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </ThemeProvider>
  );
}

export default App;
