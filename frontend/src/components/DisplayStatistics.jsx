import { VictoryBar, VictoryChart, VictoryPie, VictoryStack, VictoryTheme, VictoryAxis, VictoryBoxPlot } from 'victory';
import { Grid } from '@mui/material';

const DisplayTests = ({ tests }) => {

  // obj is either built-ins, language or intl402
  const addSubPath = (obj, subPathType, subPath, version, lines) => {
    if (!obj[subPath]) {
      obj[subPath] = { 'versions': initVersions() };
      obj[subPath].total = 0;
      obj[subPath].type = subPathType;
      obj[subPath].lines = [];
    }

    obj[subPath].versions[version]++;
    obj[subPath].total++;
    obj[subPath].lines.push(lines);
  }

  const initVersions = () => {
    return {
      5: 0,
      6: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      "undefined": 0
    };
  }

  const mapVersions = (versions) => {
    let list = [];
    Object.keys(versions).forEach(v => { list.push({ 'version': v, 'number': versions[v] }) });
    return list.filter(elm => { return elm.number !== 0 });
  }

  const statPie = () => {
    let versions = initVersions();
    let subPath = {};

    tests.forEach(elm => {
      versions[elm.version]++;

      // add subpath
      if (elm['built-ins']) {
        addSubPath(subPath, 'built-ins', elm['built-ins'], elm.version, elm.lines);
      }
      if (elm['languages']) {
        addSubPath(subPath, 'languages', elm['languages'], elm.version, elm.lines);
      }
      if (elm['intl402']) {
        addSubPath(subPath, 'intl402', elm['intl402'], elm.version, elm.lines);
      }
    });

    let stackList = [[[], [], [], [], [], [], []], []];
    let linesList = [];
    Object.keys(subPath).forEach(elm => {
      stackList[0][0].push({ 'x': elm, 'y': Math.round(100 * subPath[elm].versions[5] / subPath[elm].total) });
      stackList[0][1].push({ 'x': elm, 'y': Math.round(100 * subPath[elm].versions[6] / subPath[elm].total) });
      stackList[0][2].push({ 'x': elm, 'y': Math.round(100 * subPath[elm].versions[8] / subPath[elm].total) });
      stackList[0][3].push({ 'x': elm, 'y': Math.round(100 * subPath[elm].versions[9] / subPath[elm].total) });
      stackList[0][4].push({ 'x': elm, 'y': Math.round(100 * subPath[elm].versions[10] / subPath[elm].total) });


      stackList[0][5].push({ 'x': elm, 'y': parseInt(100 * subPath[elm].versions[11] / subPath[elm].total) });
      stackList[0][6].push({ 'x': elm, 'y': parseInt(100 * subPath[elm].versions['undefined'] / subPath[elm].total) });

      stackList[1].push(elm);
      linesList.push({ 'x': elm, 'y': subPath[elm].lines });
    });

    return [
      mapVersions(versions)
      , stackList
      , linesList
    ];
    // stackList = [{x:"subpath", y:0}]
  }

  const statistics = statPie();

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <VictoryPie
            theme={VictoryTheme.material}
            data={statistics[0]}
            x="version"
            y="number"
          />
        </Grid>
        <Grid item xs={6}>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
          >
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 8, padding: 0 }
              }}
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[...Array(statistics[1][1].length).keys()]}
              tickFormat={statistics[1][1]}
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
        <Grid item xs={6}>
          <VictoryChart domainPadding={12}>
            <VictoryBoxPlot
              horizontal
              boxWidth={20}
              whiskerWidth={10}
              data={statistics[2]}
            />
          </VictoryChart>
        </Grid>
      </Grid>

    </>
  );
}
export default DisplayTests
