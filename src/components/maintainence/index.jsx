import { motion } from 'framer-motion';
// material
import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../animate';
import { UnderMaintainenceIcon } from '../../assets/icons';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function UnderMaintainence({
  initialMinute = 59,
  initialSeconds = 59,
}) {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <RootStyle>
      <Container>
        <MotionContainer initial="initial" open>
          <Box
            sx={{
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <motion.div variants={varBounceIn}>
              <Box
                sx={{
                  mx: 'auto',
                  my: 5,
                }}
              >
                <UnderMaintainenceIcon />
              </Box>
            </motion.div>
            <motion.div variants={varBounceIn}>
              <Typography sx={{ fontSize: 34 }} variant="h4" paragraph>
                Hang on! We are under maintainence
              </Typography>
            </motion.div>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', mt: 3, fontSize: 28 }}
            >
              It will not take a long time till we get the error fixed. We will
              live again in
            </Typography>

            {minutes === 0 && seconds === 0 ? null : (
              <Typography sx={{ fontSize: 40, mt: 2 }}>
                {' '}
                00 : {minutes} : {seconds < 10 ? `0${seconds}` : seconds}
              </Typography>
            )}
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
