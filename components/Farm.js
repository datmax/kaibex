


export default function Farm(props){
    return(<div className="w-full lg:w-5/6 xl:w-2/3  card p-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-5 ">
            <div className="first flex">
            <img src="https://media.elrond.com/tokens/asset/MEX-455c57/logo.svg" className="w-10 mr-2"  />
            <div className="title py-4"> 
            <h2>Farm name</h2>
            <h2 className=" text-slate-300 ">CACA</h2>

            </div>
            </div>
            <div className='section w-full py-4'>
            <h2>APR</h2>
            <h3>11%/135%</h3>
        </div>
        <div className='section w-full py-4'>
            <h2>My staked kaibi</h2>
            <h3>11%/135%</h3>
        </div>
        <div className='section w-full py-4'>
            <h2>My earned kaibi</h2>
            <h3>11%/135%</h3>
        </div>
        <div className='grid grid-cols-3 py-4  '>
            <div className="mx-auto"> 
            <button className="border-2 border-white my-2 p-2 card">WEEE</button>

            </div>
            <div className="mx-auto"> 
            <button className="border-2 border-white my-2 p-2 card">WOOO</button>

            </div >            <div className="mx-auto"> 
            <button className="border-2 border-white my-2 p-2 card">WEEE</button>

            </div>



        </div>
        </div>
       
    </div>)
}