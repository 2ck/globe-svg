import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature

plt.figure(figsize=(10, 10))

# Set center
ax = plt.axes(projection=ccrs.Orthographic(10, 5))

ax.set_global()

# [west, east, south, north]
ax.set_extent([-30, 60, 25, 90], crs=ccrs.PlateCarree())

# Options: 110m, 50m, 10m
ax.add_feature(cfeature.LAND.with_scale("110m"), color='green')

ax.set_facecolor('blue')

plt.show()

#plt.savefig("europe.svg")
