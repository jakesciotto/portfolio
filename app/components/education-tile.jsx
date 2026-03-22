export default function EducationTile() {
  return (
    <div>
      <h3 className="text-lg font-semibold font-mono tracking-tight text-foreground mb-3">
        education
      </h3>
      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            m.s. data science
          </p>
          <p className="text-xs text-muted-foreground">
            johns hopkins university (2020-2021)
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            m.s. information technology
          </p>
          <p className="text-xs text-muted-foreground">kennesaw state (2019)</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            b.s. information technology
          </p>
          <p className="text-xs text-muted-foreground">
            kennesaw state (2014-2018)
          </p>
        </div>
      </div>
    </div>
  )
}
