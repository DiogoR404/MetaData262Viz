import { VictoryBar, VictoryChart, VictoryPie, VictoryStack, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory';
import { Grid } from '@mui/material';

const DisplayTests = ({ tests, versions }) => {

  const statPie = () => {
    const sw = Date.now();
    let versionsSumTests2 = [];
    const versionSumIndex = {};

    versions.forEach((version, i) => {
      versionsSumTests2.push({'version': version.toString() === 'undefined'? 'N/A': version.toString(), 'number': 0});
      versionSumIndex[version] = i;
    });

    let subPath = {};
    // obj is either built-ins or language
    const addSubPath = (result, subPath, version, lines) => {
      if (!result[subPath]) {
        result[subPath] = { 'versions': {} };
        versions.forEach(v => result[subPath]['versions'][v] = 0);
        result[subPath].total = 0;
        result[subPath].lines = [];
      }

      result[subPath].versions[version]++;
      result[subPath].total++;
      result[subPath].lines.push(lines);
    }

    tests.forEach(test => {
      versionsSumTests2[versionSumIndex[test.version]]['number']++;
      addSubPath(subPath, test.pathSplit[1], test.version, test.lines);
    });

    let stackList = [[], []];
    let linesList = [];
    Object.keys(subPath).forEach(elm => {
      versions.forEach((v,i) => {
        stackList[0].push([])
        stackList[0][i].push({ 'x': elm, 'y': 100 * subPath[elm].versions[v] / subPath[elm].total});
      })
      stackList[1].push(elm);
      linesList.push({ 'x': elm, 'y': subPath[elm].lines });
    });

    versionsSumTests2 = versionsSumTests2.filter(function(item) {
      return item['number'] !== 0
    })

    console.log('time calculate statistics:', Date.now() - sw)
    return [
      versionsSumTests2,
      stackList,
      linesList
    ];
  }

  const statistics = statPie();
  console.log(statistics[0]);

  Object.keys(statistics[0]).forEach(k => {
    let value = statistics[0][k]['version']
    if (value != 'N/A'){
      statistics[0][k]['version'] = 'V' + value
    }
  })


  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={5.5}>
        <VictoryPie
            theme={VictoryTheme.material}
            data={statistics[0]}
            x="version"
            y="number"
            padAngle={5}
            cornerRadius={5}
          />
        </Grid>
        <Grid item xs={6}>
          <VictoryChart
              theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickLabelComponent={(
                <VictoryLabel
                    
                    textAnchor="start"
                    x={0}
              />
              )}
              style={{
              tickLabels: {
                fontSize: 8,
              }
              }}
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              // tickValues={[...Array(statistics[1][1].length).keys()]}
              // tickFormat={statistics[1][1]}
            />
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 8, padding: 0 }
              }}
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`${x}%`)}
            />
            <VictoryStack>
              {statistics[1][0].map(elm => {
                return (
                  <VictoryBar horizontal={true} key={elm} data={elm} />
                );
              })}
            </VictoryStack>
          </VictoryChart>
        </Grid>
        {/* <Grid item xs={6}>
          <VictoryChart domainPadding={20}>
            <VictoryBoxPlot
              horizontal
              boxWidth={20}
              whiskerWidth={10}
              data={statistics[2]}
            />
          </VictoryChart>
        </Grid> */}
      </Grid>
    </>
  );
}
export default DisplayTests
