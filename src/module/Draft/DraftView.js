import ss from './DraftView.less';

function DraftView() {
    return (
        <div className={ss.wrapper}>
            <h1 className={ss.quote}>Come Back to Earth!</h1>
            <div className={ss.author}>—— Jet & Stanley.</div>
        </div>
    );
}

export {DraftView}
