import { Watermark } from "../../src/components/watermark";

export const App = () => {

  return (
    <Watermark text="https://github.com/azunyamazing" gapX={100} gapY={150}>
      <div style={{ width: '100%', height: '100vh' }}>
        https://github.com/azunyamazing
      </div>
    </Watermark>
  )
}