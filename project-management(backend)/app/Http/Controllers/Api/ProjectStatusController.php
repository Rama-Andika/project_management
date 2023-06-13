<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectStatusResource;
use App\Models\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;



class ProjectStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $projectStatus = ProjectStatus::with('projectName')->when(request()->q, function ($projectStatus) {
            $projectStatus = $projectStatus ->join('project_names', 'project_statuses.project_name_id', '=', 'project_names.id')
                                            ->whereRaw('status LIKE "%' . request()->q . '%" OR project_names.name LIKE "%' . request()->q . '%"');
        })->orderBy('project_name_id')->orderBy('project_statuses.sequence')->paginate(10);


        // ProjectStatus::join('project_names','project_names.id','=','project_statuses.project_name_id')->when(request()->q, function ($projectStatus) {
        //     $projectStatus = $projectStatus->where('status', 'like', '%' . request()->q . '%');
        // })->orderBy('project_name_id')->orderBy('project_statuses.sequence')->paginate(5);



        // ProjectStatus::where('project_name_id','=',"7")->pluck('id');
        // $arrStatus = Array($projectStatus);
        // if(count($projectStatus) > 0){
        //     foreach ($projectStatus as $value) {
        //             $projectStatus = $value;



        //     }
        // }

        //return with Api Resource
        return new ProjectStatusResource(true, 'List Data Project Status', $projectStatus);
    }

    public function searchSequence($id)
    {
        $sequence = ProjectStatus::whereId($id)->value('sequence');

        //return with Api Resource
        return new ProjectStatusResource(true, 'Sequence', $sequence);
    }

    public function searchMaxSequence($project_name_id)
    {
        $sequence = ProjectStatus::whereRaw('project_name_id = "' . $project_name_id . '"')->max('sequence');

        //return with Api Resource
        return new ProjectStatusResource(true, 'Sequence', $sequence);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $checked_status = ProjectStatus::whereRaw('project_name_id = "' . $request->project_name_id . '" AND status = "' . $request->status . '"')->value('id');
        $sequenceList = ProjectStatus::whereRaw('project_name_id = "' . $request->project_name_id . '" AND status NOT LIKE "' . $request->status . '"')->pluck('sequence');

        if ($checked_status != null) {

            return response()->json(['errors' => "Data or sequence already exists"], 422);
        } else {
            foreach ($sequenceList as $sequence) {
                if ($request->sequence == $sequence) {
                    return response()->json(['errors' => "Data or sequence already exists"], 422);
                }
            }
            $validator = Validator::make($request->all(), [

                'project_name_id'  => 'required',
                'status'     => 'required',
                'sequence'     => 'required',

            ]);



            if ($validator->fails()) {

                return response()->json($validator->errors(), 422);
            }

            // $id = IdGenerator::generate(['table' => 'project_names', 'length' => 5, 'prefix' => '0']);

            //create projectStatus

            // $projectStatus = new ProjectStatus();

            // $projectStatus->project_name_id = $id;
            // $projectStatus->name = $$request->name;
            // $projectStatus->sequence = $request->sequence;
            // $projectStatus->required_file = $id;

            // $last_sequence = ProjectStatus::orderBy('id', 'desc')->first()->sequence ?? 0;
            // $sequence = str_pad($last_sequence + 1,$last_sequence);

            $projectStatus = ProjectStatus::create([
                // 'id' => $id,

                'project_name_id' => $request->project_name_id,

                'status' => $request->status,

                'sequence' => $request->sequence,

            ]);



            if ($projectStatus) {

                //return success with Api Resource

                return new ProjectStatusResource(true, 'Data Project status Berhasil Disimpan!', $projectStatus);
            }



            //return failed with Api Resource

            return new ProjectStatusResource(false, 'Data Project Status Gagal Disimpan!', null);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $projectStatus = ProjectStatus::with('projectName')->whereId($id)->first();

        if ($projectStatus) {
            return new ProjectStatusResource(true, 'Detail data Project Status', $projectStatus);
        }

        return new ProjectStatusResource(true, 'Detail data Project Status tidak ditemukan', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ProjectStatus $projectStatus)
    {
        $last_status = ProjectStatus::whereRaw('project_name_id = "' . $request->project_name_id . '" AND status = "' . $request->status . '"')->first();
        $sequenceList = ProjectStatus::whereRaw('project_name_id = "' . $request->project_name_id . '" AND status NOT LIKE "' . $request->status . '"')->pluck('sequence');
        if ($last_status != null) {
            if ($projectStatus->id == $last_status->id) {
                foreach ($sequenceList as $sequence) {
                    if ($request->sequence == $sequence) {
                        return response()->json(['errors' => "Data or sequence already exists"], 422);
                    }
                }

                $sequence = ProjectStatus::whereId($projectStatus->id)->first()->sequence;
                $projectStatus->update([
                    'project_name_id' => $request->project_name_id,
                    'status' => $request->status,
                    'sequence' => $sequence,
                ]);

                if ($projectStatus) {
                    return new ProjectStatusResource(true, 'Data project Status berhasil di update', $projectStatus); # code...
                } else {
                    return new ProjectStatusResource(false, 'Data project Status gagal di update', null);
                }

                //$last_sequence = ProjectStatus::whereId($projectStatus->id)->first()->sequence;
                //update projectStatus withour image



            } else {
                return response()->json(['errors' => "Data or sequence already exists"], 422);
            }
        } else {
            $sequenceList = ProjectStatus::whereRaw('project_name_id = "' . $request->project_name_id . '" AND status NOT LIKE "' . $request->status . '"')->pluck('sequence');
            foreach ($sequenceList as $sequence) {
                if ($sequence === $projectStatus->sequence) {
                    return response()->json(['errors' => "Data or sequence already exists"], 422);
                }
            }

            $validator = Validator::make($request->all(), [
                'project_name_id' => 'required',
                'status' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $sequence = ProjectStatus::whereId($projectStatus->id)->first()->sequence;

            //update projectStatus withour image
            //$last_sequence = ProjectStatus::whereId($projectStatus->id)->first()->sequence;
            $projectStatus->update([
                'project_name_id' => $request->project_name_id,
                'status' => $request->status,
                'sequence' => $sequence,
            ]);

            if ($projectStatus) {
                return new ProjectStatusResource(true, 'Data project Status berhasil di update', $projectStatus); # code...
            }

            return new ProjectStatusResource(false, 'Data project Status gagal di update', null);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(ProjectStatus $projectStatus)
    {
        if ($projectStatus->delete()) {
            return new ProjectStatusResource(true, 'Data project Status berhasil di hapus', null);
        }

        return new ProjectStatusResource(false, 'Data project Status gagal di hapus', null);
    }
}