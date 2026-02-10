import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../animate';
import { NotFoundIcon } from '../../assets/icons';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
  backgroundColor: 'red',
}));

// ----------------------------------------------------------------------

export const WaitingComponent = (props) => {
  return (
    <RootStyle>
      <Container>
        <MotionContainer initial="initial" open>
          <Box
            sx={{
              maxWidth: 480,
              margin: 'auto',
              textAlign: 'center',
            }}
          >
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Something went wrong!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps
              you’ve mistyped the URL? Be sure to check your spelling.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                sx={{
                  // height: 260,
                  mx: 'auto',
                  my: { xs: 2, sm: 5 },
                }}
              >
                <NotFoundIcon />
              </Box>
            </motion.div>

            <Button
              size="large"
              variant="contained"
              component={RouterLink}
              onClick={() => props.retry()}
            >
              Retry
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
};
