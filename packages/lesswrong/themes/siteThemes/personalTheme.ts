/**
 * This is not at all generalized for multiple personal sites. Most every other
 * personal site configuration will adapt nicely (I think) to multiple people
 * running personal site, but this will need a near-rewrite.
 */

const sansSerifStack = [
  'GreekFallback', // Ensures that greek letters render consistently
  '"Helvetica Neue"',
  'Helvetica',
  'Arial',
  'sans-serif'
].join(',')

const serifStack = [
  'Georgia',
  'serif'
].join(',')

export const personalTheme: SiteThemeSpecification = {
  shadePalette: {
    fonts: {sansSerifStack, serifStack},
  },
  componentPalette: (shadePalette: ThemeShadePalette) => ({
    primary: {
      main: '#71eeb8',
    },
    secondary: {
      main: '#71eeb8',
    },
    lwTertiary: {
      main: "#23a46c",
      dark: "#23a46c"
    },
    error: {
      main: '#bf360c',
    },
  }),
  make: (palette: ThemePalette) => ({
    typography: {
      fontFamily: sansSerifStack,
      postStyle: {
        fontFamily: serifStack,
      },
      headerStyle: {
        fontFamily: serifStack,
      },
      caption: {
        // captions should be relative to their surrounding content, so they are unopinionated about fontFamily and use ems instead of rems
        fontFamily: "unset",
        fontSize: '.85em'
      },
      body2: {
        fontSize: "1.16rem"
      },
      commentStyle: {
        fontFamily: sansSerifStack,
      },
      errorStyle: {
        color: palette.error.main,
        fontFamily: sansSerifStack
      },
      headline: {
        fontFamily: serifStack,
      },
      subheading: {
        fontFamily: serifStack,
      },
      title: {
        fontFamily: serifStack,
        fontWeight: 500,
      },
      uiSecondary: {
        fontFamily: serifStack,
      },
    },
    boldLinks: true,
    overrides: {
      PostsVote: {
        voteScores: {
          margin: "25% 15% 15% 15%"
        }
      },
      MuiTooltip: {
        tooltip: {
          fontSize: "1rem",
          padding: ".7rem",
          zIndex: 10000000
        }
      },
      MuiDialogContent: {
        root: {
          fontFamily: sansSerifStack,
          fontSize: "1.16rem",
          lineHeight: "1.5em"
        }
      },
      MuiMenuItem: {
        root: {
          fontFamily: sansSerifStack,
          color: palette.grey[800],
          fontSize: "1.1rem",
          lineHeight: "1em"
        }
      },
      MuiListItem: {
        root: {
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      MuiCard: {
        root: {
          borderRadius: 1,
          boxShadow: palette.boxShadow.lwCard,
        }
      }
    }
  }),
};
