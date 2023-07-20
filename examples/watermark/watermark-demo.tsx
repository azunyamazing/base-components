import { Watermark } from "../../src/components/watermark";

export const App = () => {

  return (
    <Watermark width={300} height={230} text="https://github.com/azunyamazing">
      <div style={{ width: '100%', height: '100vh' }}>
        https://github.com/azunyamazing
      </div>
    </Watermark>
  )
}